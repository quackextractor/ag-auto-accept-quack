
const commands = new Map();

const vscode = {
    workspace: {
        getConfiguration: () => ({
            get: (key, defaultValue) => {
                if (global.mockConfig && global.mockConfig[key] !== undefined) {
                    return global.mockConfig[key];
                }
                return defaultValue;
            },
            update: async (key, value) => {
                if (!global.mockConfig) global.mockConfig = {};
                global.mockConfig[key] = value;
                if (global.mockOnDidChangeConfiguration) {
                    global.mockOnDidChangeConfiguration({
                        affectsConfiguration: (k) => k === `quack-auto-accept.${key}`
                    });
                }
                return Promise.resolve();
            }
        }),
        onDidChangeConfiguration: (cb) => {
            global.mockOnDidChangeConfiguration = cb;
            return { dispose: () => { } };
        }
    },
    ConfigurationTarget: {
        Global: 1,
        Workspace: 2,
        WorkspaceFolder: 3
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
        }),
        showInputBox: async () => {
            if (global.mockInputBoxValue !== undefined) {
                return Promise.resolve(global.mockInputBoxValue);
            }
            return Promise.resolve(undefined);
        }
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
