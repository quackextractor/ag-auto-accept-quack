# Antigravity Auto Accept Quack

[![Version](https://img.shields.io/badge/version-1.0.5-blue.svg)](https://github.com/quackextractor/ag-auto-accept-quack)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**True hands-free automation for your Antigravity Agent (Quack Edition).**

This extension uses a DOM text-matching workaround designed for newer versions (like 1.18.4) where standard VS Code commands (`antigravity.agent.acceptAgentStep`) might not work or where Google changed the DOM classes.

It searches for buttons with text content matching `Accept`, `Run`, `Always Allow`, or `Allow` and automatically clicks them. 

*(Note: Because standard VS Code extensions do not share a DOM with the main IDE window, this extension serves as a proof of concept. To manually apply the workaround, you can toggle Developer Tools and paste the script directly into the Console).*

---

### Option 1: Install from Open VSX (Recommended for Autoupdate)

Antigravity IDE is compatible with the [Open VSX Registry](https://open-vsx.org/). This is the best way to get **automatic updates**.

1. Open Antigravity IDE
2. Go to the **Extensions** view
3. Search for `ag-auto-accept-quack`
4. Click **Install**

### Option 2: Install from GitHub Releases

If you prefer to stay on GitHub, you can download the latest `.vsix` from the [Releases](https://github.com/quackextractor/ag-auto-accept-quack/releases) page.

1. Download the latest `ag-auto-accept-quack.vsix`
2. Open Antigravity IDE
3. Go to Extensions -> Click `...` menu -> **Install from VSIX...**
4. Select the downloaded file

> [!TIP]
> To enable "autoupdate from GitHub" without the Marketplace, you can use the [VS Code Extension Updater](https://marketplace.visualstudio.com/items?itemName=felipecaputo.vscode-extension-updater) and follow its configuration for GitHub.

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
