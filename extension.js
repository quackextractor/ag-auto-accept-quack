const vscode = require('vscode');
const http = require('http');
const cp = require('child_process');

let WebSocket;
let autoAcceptInterval = null;
let enabled = true;
let statusBarItem;
const DEBUG_PORT = 9222;

let hasShownPortError = false;

function activate(context) {
    try {
        WebSocket = require('ws');
    } catch (e) {
        vscode.window.showErrorMessage(
            'Quack Auto-Accept: WebSocket module not found. Would you like to install it now?',
            'Install ws'
        ).then(selection => {
            if (selection === 'Install ws') {
                const extensionPath = context.extensionPath || __dirname;
                vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: "Installing ws module...",
                    cancellable: false
                }, () => {
                    return new Promise((resolve, reject) => {
                        cp.exec('npm install ws', { cwd: extensionPath }, (error) => {
                            if (error) {
                                vscode.window.showErrorMessage('Quack Auto-Accept: Failed to install ws: ' + error.message);
                                reject(error);
                            } else {
                                vscode.window.showInformationMessage('Quack Auto-Accept: Successfully installed ws module. Please reload the window.', 'Reload Window')
                                    .then(reloadSelection => {
                                        if (reloadSelection === 'Reload Window') {
                                            vscode.commands.executeCommand('workbench.action.reloadWindow');
                                        }
                                    });
                                resolve();
                            }
                        });
                    });
                });
            }
        });
    }

    let disposable = vscode.commands.registerCommand('unlimited.toggle', function () {
        enabled = !enabled;
        updateStatusBar();
        if (enabled) {
            vscode.window.showInformationMessage('Auto-Accept: ON');
            // Reset the error throttle so it can warn the user again if it fails
            hasShownPortError = false;
        } else {
            vscode.window.showInformationMessage('Auto-Accept: OFF');
        }
    });
    context.subscriptions.push(disposable);

    try {
        statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 10000);
        statusBarItem.command = 'unlimited.toggle';
        context.subscriptions.push(statusBarItem);

        updateStatusBar();
        statusBarItem.show();
    } catch (e) {
        vscode.window.showErrorMessage('Quack Auto-Accept: Failed to create status bar item. Error: ' + e.message);
    }

    vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('quack-auto-accept.interval')) {
            if (autoAcceptInterval) {
                clearInterval(autoAcceptInterval);
            }
            startLoop();
        }
    });

    startLoop();
}

function updateStatusBar() {
    if (!statusBarItem) return;

    if (enabled) {
        statusBarItem.text = "Quack Auto-Accept: ON";
        statusBarItem.tooltip = "Quack Auto-Accept is Executing via CDP (Click to Pause)";
        statusBarItem.backgroundColor = undefined;
    } else {
        statusBarItem.text = "Quack Auto-Accept: OFF";
        statusBarItem.tooltip = "Quack Auto-Accept is Paused (Click to Resume)";
        statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    }
}

function startLoop() {
    const config = vscode.workspace.getConfiguration('quack-auto-accept');
    const intervalMs = config.get('interval', 1500);

    autoAcceptInterval = setInterval(async () => {
        if (!enabled || !WebSocket) return;
        injectViaCDP();
    }, intervalMs);
}

function injectViaCDP() {
    http.get(`http://127.0.0.1:${DEBUG_PORT}/json`, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            try {
                const targets = JSON.parse(data);

                const webviewTargets = targets.filter(t => t.url && t.url.includes('vscode-webview://'));

                webviewTargets.forEach(target => {
                    executeScriptInTarget(target.webSocketDebuggerUrl);
                });

                // Reset port error state on successful connection
                hasShownPortError = false;
            } catch (err) {
                vscode.window.showErrorMessage('Quack Auto-Accept: Failed to parse CDP targets. Error: ' + err.message);
            }
        });
    }).on('error', (err) => {
        if (!hasShownPortError) {
            vscode.window.showErrorMessage('Quack Auto-Accept: Failed to connect to debugging port. Ensure VS Code was launched with --remote-debugging-port=9222. Error: ' + err.message);
            hasShownPortError = true;
        }
    });
}

function executeScriptInTarget(wsUrl) {
    if (!wsUrl) return;

    const ws = new WebSocket(wsUrl);

    ws.on('open', () => {
        const scriptToInject = `
            (function() {
                const expandSpans = Array.from(document.querySelectorAll('span[role="button"]'));
                expandSpans.forEach(span => {
                    if (span.textContent.includes('Expand all')) {
                        span.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                    }
                });

                const buttons = Array.from(document.querySelectorAll('button'));
                const acceptBtn = buttons.find(b => b.textContent && (b.textContent.includes('Accept') || b.textContent.includes('Run') || b.textContent.includes('Always Allow') || b.textContent.includes('Allow')));
                
                if (acceptBtn) {
                    acceptBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
                }
            })();
        `;

        const message = {
            id: 1,
            method: 'Runtime.evaluate',
            params: {
                expression: scriptToInject,
                returnByValue: true
            }
        };

        ws.send(JSON.stringify(message));
    });

    ws.on('message', () => {
        ws.close();
    });

    ws.on('error', (err) => {
        vscode.window.showErrorMessage('Quack Auto-Accept: WebSocket error encountered. Error: ' + err.message);
    });
}

function deactivate() {
    if (autoAcceptInterval) {
        clearInterval(autoAcceptInterval);
    }
}

module.exports = {
    activate,
    deactivate
}