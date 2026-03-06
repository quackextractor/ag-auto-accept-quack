# Antigravity Auto Accept Quack

[![Version](https://img.shields.io/badge/version-1.0.3-blue.svg)](https://github.com/quackextractor/ag-auto-accept-quack)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**True hands-free automation for your Antigravity Agent (Quack Edition).**

This extension uses a DOM text-matching workaround designed for newer versions (like 1.18.4) where standard VS Code commands (`antigravity.agent.acceptAgentStep`) might not work or where Google changed the DOM classes.

It searches for buttons with text content matching `Accept`, `Run`, `Always Allow`, or `Allow` and automatically clicks them. 

*(Note: Because standard VS Code extensions do not share a DOM with the main IDE window, this extension serves as a proof of concept. To manually apply the workaround, you can toggle Developer Tools and paste the script directly into the Console).*

---

## Installation

### Option 1: Install from VSIX

1. Open Antigravity IDE
2. Go to Extensions -> Click ... menu -> Install from VSIX...
3. Select the built `.vsix` file
4. Restart the IDE

### Option 2: Build from Source

```bash
git clone https://github.com/quackextractor/ag-auto-accept-quack.git
cd ag-auto-accept-quack
npm install -g @vscode/vsce
vsce package
```

Then install the generated .vsix file as described above.

---

## Features

| Feature | Description |
|---------|-------------|
| **DOM Match** | Uses `b.textContent.includes('Accept')` style matching |
| **Toggle Control** | Click status bar or use keyboard shortcut |
| **Visual Status** | ON / OFF indicators |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Alt+Shift+U` | Toggle Auto-Accept ON/OFF |
| `Cmd+Alt+Shift+U` (Mac) | Toggle Auto-Accept ON/OFF |

---

## 📜 License

MIT - See [LICENSE](LICENSE) for details.
