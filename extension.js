const vscode = require('vscode');
const http = require('http');
const cp = require('child_process');

let WebSocket;
let autoAcceptInterval = null;
let enabled = true;
let statusBarItem;
let quackHelpStatusBarItem;
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

    let helpDisposable = vscode.commands.registerCommand('quack.help', function () {
        const panel = vscode.window.createWebviewPanel(
            'quackTroubleshooting',
            'Quack Troubleshooting',
            vscode.ViewColumn.One,
            {}
        );

        panel.webview.html = getWebviewContent();
    });
    context.subscriptions.push(helpDisposable);

    try {
        statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 10000);
        statusBarItem.command = 'unlimited.toggle';
        context.subscriptions.push(statusBarItem);

        updateStatusBar();
        statusBarItem.show();

        quackHelpStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 9999);
        quackHelpStatusBarItem.command = 'quack.help';
        quackHelpStatusBarItem.text = '$(question) Quack Help';
        quackHelpStatusBarItem.tooltip = 'Show Troubleshooting Manual for Quack Auto-Accept';
        context.subscriptions.push(quackHelpStatusBarItem);
        quackHelpStatusBarItem.show();
    } catch (e) {
        vscode.window.showErrorMessage('Quack Auto-Accept: Failed to create status bar item. Error: ' + e.message);
    }

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
    autoAcceptInterval = setInterval(async () => {
        if (!enabled || !WebSocket) return;
        injectViaCDP();
    }, 500);
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
                const acceptBtn = buttons.find(b => {
                    const text = b.textContent.trim();
                    return text === 'Accept' || text === 'Run' || text === 'Always Allow' || text === 'Allow';
                });
                
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

function getWebviewContent() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quack Troubleshooting</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-editor-foreground);
            background-color: var(--vscode-editor-background);
            padding: 20px;
            line-height: 1.6;
        }
        h1, h2, h3 {
            color: var(--vscode-editor-foreground);
        }
        code {
            font-family: var(--vscode-editor-font-family);
            background-color: var(--vscode-textCodeBlock-background);
            padding: 2px 4px;
            border-radius: 3px;
        }
        pre {
            background-color: var(--vscode-textCodeBlock-background);
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <h2>Setting Up Your Debug Configuration</h2>
    <p>To ensure your testing environment always opens with the correct debugging port enabled, you need to configure the launch settings for your workspace.</p>
    <p>Here are the steps to set this up:</p>
    <ol>
        <li><strong>Locate the <code>.vscode</code> folder:</strong> Look in the root directory of your extension project. If a folder named <code>.vscode</code> does not exist, create it.</li>
        <li><strong>Create the file:</strong> Inside the <code>.vscode</code> folder, create a new file and name it <code>launch.json</code>.</li>
        <li><strong>Add the configuration:</strong> Paste the complete JSON code provided below into the file. The critical addition here is the <code>--remote-debugging-port=9222</code> flag inside the <code>args</code> array.</li>
    </ol>
    <pre><code>{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Run Extension with CDP",
            "type": "extensionHost",
            "request": "launch",
            "args": [
                "--extensionDevelopmentPath=\${workspaceFolder}",
                "--remote-debugging-port=9222"
            ]
        }
    ]
}</code></pre>
    <p>Once this is saved, you can press <strong>F5</strong> or navigate to the Run and Debug view in your sidebar to launch the extension. This will open a new Extension Development Host window that is fully equipped to accept the Chrome DevTools Protocol connections your script is attempting to make.</p>
</body>
</html>`;
}

module.exports = {
    activate,
    deactivate
}