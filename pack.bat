@echo off
setlocal

echo ========================================
echo Packaging VS Code Extension...
echo ========================================

echo.
echo [1/4] Running code quality checks...
call npm run lint
if %errorlevel% neq 0 (
    echo [ERROR] Linting failed! Aborting build.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/4] Running tests...
call npm test
if %errorlevel% neq 0 (
    echo [ERROR] Tests failed! Aborting build.
    pause
    exit /b %errorlevel%
)

echo.
echo [3/4] Converting icon.svg to icon.png...
call npx -y sharp-cli@latest -i icon.svg -o icon.png
if %errorlevel% neq 0 (
    echo [ERROR] Icon conversion failed! Aborting build.
    pause
    exit /b %errorlevel%
)

echo.
echo [4/4] Packing the extension...
call npx -y @vscode/vsce package
if %errorlevel% neq 0 (
    echo [ERROR] Packaging failed! Aborting build.
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================
echo Extension packaged successfully!
echo ========================================
pause
