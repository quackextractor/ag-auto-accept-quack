@echo off
echo Installing @vscode/vsce globally if not present...
call npm install -g @vscode/vsce

echo Packing the VS Code extension...
call npx vsce package

echo Done!
pause
