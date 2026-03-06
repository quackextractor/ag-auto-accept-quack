
const commands = new Map();

const vscode = {
    StatusBarAlignment: {
        Right: 1
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
        showInformationMessage: () => { }
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
