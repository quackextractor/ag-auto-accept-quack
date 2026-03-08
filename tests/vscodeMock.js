
const commands = new Map();

const vscode = {
    workspace: {
        getConfiguration: () => ({
            get: (key, defaultValue) => defaultValue
        }),
        onDidChangeConfiguration: (cb) => {
            return { dispose: () => { } };
        }
    },
    StatusBarAlignment: {
        Right: 1
    },
    ViewColumn: {
        One: 1
    },
    ProgressLocation: {
        Notification: 15
    },
    window: {
        registerCommand: (id, callback) => {
            commands.set(id, callback);
            return { dispose: () => { } };
        },
        createStatusBarItem: () => ({
            show: () => { },
            command: '',
            text: '',
            tooltip: '',
            backgroundColor: undefined
        }),
        showInformationMessage: (msg, ...items) => Promise.resolve(items.length > 0 ? items[0] : undefined),
        showErrorMessage: (msg, ...items) => Promise.resolve(items.length > 0 ? items[0] : undefined),
        withProgress: (options, task) => {
            return task({ report: () => { } });
        },
        createWebviewPanel: () => ({
            webview: {
                html: ''
            }
        })
    },
    commands: {
        registerCommand: (id, callback) => {
            commands.set(id, callback);
            return { dispose: () => { } };
        },
        executeCommand: async () => {
            // console.log(`Executing command: ${id}`);
            return Promise.resolve();
        }
    },
    ThemeColor: function (name) { this.name = name; }
};

module.exports = { vscode, commands };
