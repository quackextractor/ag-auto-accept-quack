# Antigravity Auto Accept Quack

[![Version](https://img.shields.io/badge/version-1.0.11-blue.svg)](https://github.com/quackextractor/ag-auto-accept-quack)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**True hands-free automation for your Antigravity Agent (Quack Edition).**

This extension uses a DOM text-matching workaround designed for newer versions (like 1.18.4) where standard VS Code commands (`antigravity.agent.acceptAgentStep`) might not work or where Google changed the DOM classes.

It searches for buttons with text content matching `Accept`, `Run`, `Always Allow`, or `Allow` and automatically clicks them. It also clicks "Expand all" spans to reveal hidden agent steps.

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

## Issues & Contributing

I welcome feedback, bug reports, and feature requests!

Before submitting an issue, please check the [Issue Tracker](https://github.com/quackextractor/ag-auto-accept-quack/issues) to see if it has already been reported.

### Bug Reports
If you encounter a problem, please [Open a Bug Report](https://github.com/quackextractor/ag-auto-accept-quack/issues/new). When reporting a bug, try to include:
- Your OS and VS Code version.
- The version of the Antigravity Agent.
- Explicit steps to reproduce the issue.

### Feature Requests
Have an idea to improve the extension? [Submit a Feature Request](https://github.com/quackextractor/ag-auto-accept-quack/issues/new) detailing what you want to achieve and how it would help.

### Contributing
Pull requests are welcome! If you're working on something significant, please open an issue first to discuss your proposed changes.

---

## Credits

Special thanks to **pesosz** for the original idea that inspired this project. While the source code for this "Quack Edition" has been completely rewritten to use DOM text-matching for ne`we`r Antigravity versions, the core concept remains a tribute to the original tool.

## License

MIT - See [LICENSE](LICENSE) for details.
