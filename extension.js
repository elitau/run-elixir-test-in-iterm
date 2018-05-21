const vscode = require('vscode');
const { exec } = require('child_process');

function activate(context) {
    let runAllTestsInFile = vscode.commands.registerCommand('extension.runAllTestsInFile', runAllTestsInFileExec);
    context.subscriptions.push(runAllTestsInFile);

    let runLastCommandInIterm = vscode.commands.registerCommand('extension.runLastCommandInIterm', runLastCommandInItermExec);
    context.subscriptions.push(runLastCommandInIterm);

    let runFocusedTest = vscode.commands.registerCommand('extension.runFocusedTest', runFocusedTestExec);
    context.subscriptions.push(runFocusedTest);
}
exports.activate = activate;

function runAllTestsInFileExec() {
    // Display a message box to the user
    // vscode.window.showInformationMessage('Hello World!');
    _executeCodeViaChildProcess("mix test " + _activeFilePath());
}

function runLastCommandInItermExec() {
    // Display a message box to the user
    // vscode.window.showInformationMessage('Hello World!');
    _executeCodeViaChildProcess("!!");
}

function runFocusedTestExec() {
    var currentLine = vscode.window.activeTextEditor.selection.active.line;
    _executeCodeViaChildProcess("mix test " + _activeFilePath() + ":" + currentLine);
}


function _activeFilePath() {
    var fullFilePath = vscode.window.activeTextEditor.document.fileName;
    var projectFolder = vscode.workspace.rootPath;
    return fullFilePath.replace(projectFolder + "/", "");
}

function _executeCodeViaChildProcess(code) {
    const command =
        `osascript ` +
        ` -e 'tell app "iTerm"' ` +
        ` -e 'reopen' ` +
        ` -e 'activate' ` +
        ` -e 'set mysession to current session of current window' ` +
        ` -e 'tell mysession to write text "${code}"' ` +
        ` -e 'end tell'`;

    exec(command);
}
