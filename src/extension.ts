import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('multi-file-creator', async (uri: vscode.Uri) => {
        try {
            // Prompt for the desired name
            const name = await vscode.window.showInputBox({ prompt: 'Enter the component name' });
            if (!name) {
                vscode.window.showErrorMessage('Component name is required');
                return;
            }

            // Paths for the new files
            const folderPath = uri.fsPath;
            const razorFilePath = path.join(folderPath, `${name}.razor`);
            const razorCsFilePath = path.join(folderPath, `${name}.razor.cs`);
            const razorScssFilePath = path.join(folderPath, `${name}.razor.scss`);

            // Check if the file already exists
            try {
                await fs.access(razorFilePath);
                vscode.window.showInformationMessage(`Blazor component already exists with name: ${name}`);
            } catch {
                // File does not exist, proceed to create the files
                await fs.writeFile(razorFilePath, `<h3>${name} component</h3>`);
                await fs.writeFile(razorCsFilePath, `public partial class ${name} { }`);
                await fs.writeFile(razorScssFilePath, `/* Styles for ${name} component */`);

                vscode.window.showInformationMessage(`Blazor component files created for ${name}`);
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to create Blazor component files: ${error instanceof Error ? error.message : String(error)}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() { }
