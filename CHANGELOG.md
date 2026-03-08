# Changelog
All notable changes to the "ag-auto-accept-quack" extension will be documented in this file.

## [1.2.0] - 2026-03-08
### Added
- Configurable auto-accept interval in extension settings (`quack-auto-accept.interval`).
### Changed
- Updated auto-accept match logic to use `.includes` for better compatibility.

## [1.1.9] - 2026-03-08
### Changed
- Updated README.md

## [1.1.8] - 2026-03-08
### Added
- Added `ws` dependency

## [1.1.7] - 2026-03-08
### Added
- Added `.vscode/launch.json` for proper remote debugging configuration setup.

## [1.1.6] - 2026-03-08
### Removed
- Removed the Quack troubleshooting status bar widget and command `quack.help`.

## [1.1.4] - 2026-03-08
### Changed
- Updated publish workflow to add `version.md`.

## [1.1.3] - 2026-03-07
### Changed
- Configured GitHub Actions publishing workflow to automatically update the version badge.
### Added
- Auto-install functionality for the `ws` dependency if missing.

## [1.1.1] - 2026-03-07
### Added
- Added built-in troubleshooting manual accessible via the `quack-help` status bar item and command.
- Detailed debugging configuration guide directly in the extension and README.

## [1.0.11] - 2026-03-06
### Added
- Expanded the Issues & Contributing section in README.md to help users better report bugs and request features.

## [1.0.10] - 2026-03-06
### Changed
- Updated CI/CD to use Node.js 20 and the modern `@vscode/vsce` package builder.

## [1.0.9] - 2026-03-06
### Changed
- Configured GitHub Actions to automatically bump version and publish the extension on every push to master.

## [1.0.8] - 2026-03-06
### Changed
- Updated documentation with instructions for Open VSX namespace verification.
- Added verification status note to README.

## [1.0.7] - 2026-03-06
### Added
- Added GitHub Action workflow for automated building and publishing to GitHub Releases and Open VSX.
- Updated README with autoupdate instructions via Open VSX and GitHub Releases.
- Added credits to **pesosz** for the original project concept.
- Configured repository secrets for secure automated publishing.

## [1.0.6] - 2026-03-06
### Added
- Integrated ESLint into the build process for automated code quality checks.
### Changed
- Improved `pack.bat` script to include error handling and execute linting and tests prior to packaging.

## [1.0.5] - 2026-03-06
### Fixed
- Fixed SVG icon packaging error by automatically converting `icon.svg` to `icon.png` during build.
### Changed
- Improved `pack.bat` to avoid global installation and use `npx` directly.
- Updated README to reflect `pack.bat` usage for building from source.

## [1.0.4] - 2026-03-06
### Changed
- Updated extension icon to use a duck SVGs.

## [1.0.3] - 2026-03-06
### Added
- Refined Auto-Accept logic and commands for Quack edition.

## [1.0.2] - 2026-03-06
### Added
- Added logic to automatically click "Expand all" spans to reveal hidden agent steps.

## [1.0.1] - 2026-03-06
### Added
- Added `pack.bat` helper script to easily package the extension into a `.vsix` file.

## [1.0.0] - 2026-03-06
### Added
- Initial release of Quack edition.
- Used DOM text-matching logic from `assignment.txt` instead of calling internal VS Code commands.
