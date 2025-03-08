import {existsSync} from "fs";
import * as vscode from "vscode";
import path from "path";
import {COMPONENT_NAME_PLACEHOLDER} from "../../constants/placeholders";
import {COMPONENT_CONTENT, STYLES_CONTENT} from "./boilerplate";

export const createNewComponent = async () => {
  if (
    !vscode.workspace.workspaceFolders ||
    vscode.workspace.workspaceFolders.length === 0
  ) {
    vscode.window.showErrorMessage("No workspace folder found.");
    return;
  }

  const folderUri = await vscode.window.showOpenDialog({
    canSelectFolders: true,
    canSelectFiles: false,
    canSelectMany: false,
    openLabel: "Where should component be created ?",
    title: "Select folder",
  });

  if (!folderUri || folderUri.length === 0) {
    vscode.window.showErrorMessage("No folder selected.");
    return;
  }

  const folderPath = path.join(folderUri[0].fsPath);

  if (!existsSync(folderPath)) {
    await vscode.window.showErrorMessage("Folder does not exist.");
    return;
  }

  const componentName = await vscode.window.showInputBox({
    prompt: "Enter the component name",
    placeHolder: "Component",
    validateInput: (text) => {
      const trimmedText = text.trim();
      if (trimmedText.length === 0) {
        return "Component name cannot be empty";
      }
      if (!trimmedText.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/)) {
        return "Component name must be a valid js-function name";
      }
      return null;
    },
  });

  if (!componentName) {
    vscode.window.showErrorMessage("Component name cannot be empty.");
    return;
  }

  const componentPath = path.join(folderPath, componentName);
  if (existsSync(componentPath)) {
    await vscode.window.showErrorMessage(
      `Component ${componentName} already exists.`,
    );
    return;
  }

  await vscode.workspace.fs.createDirectory(vscode.Uri.file(componentPath));

  const indexPath = path.join(componentPath, "index.tsx");
  const stylesPath = path.join(componentPath, "styles.ts");

  await vscode.workspace.fs.writeFile(
    vscode.Uri.file(indexPath),
    Buffer.from(
      COMPONENT_CONTENT.replace(COMPONENT_NAME_PLACEHOLDER, componentName),
    ),
  );
  await vscode.workspace.fs.writeFile(
    vscode.Uri.file(stylesPath),
    Buffer.from(STYLES_CONTENT),
  );

  const indexFile = await vscode.workspace.openTextDocument(indexPath);

  const stylesFile = await vscode.workspace.openTextDocument(stylesPath);

  await vscode.window.showTextDocument(indexFile);
  await vscode.window.showTextDocument(stylesFile);
  await vscode.window.showTextDocument(indexFile);
};
