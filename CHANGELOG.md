# Changelog
All notable changes to the "ag-auto-accept-quack" extension will be documented in this file.

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
