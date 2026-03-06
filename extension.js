const vscode = require('vscode');

let autoAcceptInterval = null;
let enabled = true;
let statusBarItem;

function activate(context) {
    // Register toggle command
    let disposable = vscode.commands.registerCommand('unlimited.toggle', function () {
        enabled = !enabled;
        updateStatusBar();
        if (enabled) {
            vscode.window.showInformationMessage('Auto-Accept: ON');
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
        // Silent failure in production to avoid harassing user
    }

    // Start the loop
    startLoop();
}

function updateStatusBar() {
    if (!statusBarItem) return;

    if (enabled) {
        statusBarItem.text = "Auto-Accept: ON";
        statusBarItem.tooltip = "Unlimited Auto-Accept is Executing (Click to Pause)";
        statusBarItem.backgroundColor = undefined;
    } else {
        statusBarItem.text = "Auto-Accept: OFF";
        statusBarItem.tooltip = "Unlimited Auto-Accept is Paused (Click to Resume)";
        statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    }
}

function startLoop() {
    autoAcceptInterval = setInterval(async () => {
        if (!enabled) return;

        try {
            if (typeof document !== 'undefined') {
                const expandSpans = Array.from(document.querySelectorAll('span[role="button"]'));
                expandSpans.forEach(span => {
                    if (span.textContent.includes('Expand all')) span.click();
                });

                const buttons = Array.from(document.querySelectorAll('button'));
                const acceptBtn = buttons.find(b => b.textContent.includes('Accept') ||
                    b.textContent.includes('Run') ||
                    b.textContent.includes('Always Allow') ||
                    b.textContent.includes('Allow'));
                if (acceptBtn) acceptBtn.click();
            }
        } catch (e) {
            // Silent error handling
        }
    }, 1500);
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
