import {existsSync} from "fs";
import path from "path";
import * as vscode from "vscode";
import {formatBoilerplate} from "../../utils/boilerplateFormatter";
import {
  REDUCER_CONTENT,
  SELECTORS_CONTENT,
  REDUCER_IMPORT_LINE,
  REDUCER_REGISTER_LINE_REPLACE,
  REDUCER_REGISTER_LINE_SEARCH,
} from "./boilerplate";

export const createReducer = async () => {
  if (
    !vscode.workspace.workspaceFolders ||
    vscode.workspace.workspaceFolders.length === 0
  ) {
    vscode.window.showErrorMessage("No workspace folder found.");
    return;
  }
  const projectRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
  const storeFolder = path.join(projectRoot, "src", "store");
  const storeRootReducerPath = path.join(storeFolder, "rootReducer.ts");
  const modulesPath = path.join(storeFolder, "modules");
  const allModules = (
    await vscode.workspace.fs.readDirectory(vscode.Uri.file(modulesPath))
  ).map(([name]) => name);

  const modules = allModules.filter((name) => {
    const reducerPath = path.join(modulesPath, name, "reducer", "index.ts");
    return !existsSync(reducerPath);
  });

  if (modules.length === 0) {
    await vscode.window.showErrorMessage("No module without reducer found.");
    return;
  }

  if (!existsSync(storeFolder) || !existsSync(storeRootReducerPath)) {
    await vscode.window.showErrorMessage("Store is invalid.");
    return;
  }

  const {label: moduleName} = (await vscode.window.showQuickPick(
    modules.map((name) => ({label: name})),
    {
      placeHolder: "Choose a module",
      matchOnDetail: true,
      ignoreFocusOut: true,
    },
  )) ?? {label: undefined};

  if (!moduleName) {
    return;
  }

  const modulePath = path.join(
    projectRoot,
    "src",
    "store",
    "modules",
    moduleName,
  );

  const reducerFolderPath = path.join(modulePath, "reducer");
  const reducerPath = path.join(reducerFolderPath, "index.ts");

  const selectorsFolderPath = path.join(modulePath, "selectors");
  const selectorsPath = path.join(selectorsFolderPath, "index.ts");

  await vscode.workspace.fs.createDirectory(vscode.Uri.file(reducerFolderPath));
  await vscode.workspace.fs.writeFile(
    vscode.Uri.file(reducerPath),
    Buffer.from(formatBoilerplate(REDUCER_CONTENT, {moduleName})),
  );

  await vscode.workspace.fs.createDirectory(
    vscode.Uri.file(selectorsFolderPath),
  );
  await vscode.workspace.fs.writeFile(
    vscode.Uri.file(selectorsPath),
    Buffer.from(formatBoilerplate(SELECTORS_CONTENT, {moduleName})),
  );

  const storeRootReducerFile = await vscode.workspace.fs.readFile(
    vscode.Uri.file(storeRootReducerPath),
  );

  const storeRootReducerLines = storeRootReducerFile.toString().split("\n");
  storeRootReducerLines.unshift(
    formatBoilerplate(REDUCER_IMPORT_LINE, {moduleName}),
  );
  const lineIndex = storeRootReducerLines.findIndex((line) =>
    line.includes(REDUCER_REGISTER_LINE_SEARCH),
  );

  storeRootReducerLines[lineIndex] = storeRootReducerLines[lineIndex].replace(
    REDUCER_REGISTER_LINE_SEARCH,
    formatBoilerplate(REDUCER_REGISTER_LINE_REPLACE, {moduleName}),
  );

  await vscode.workspace.fs.writeFile(
    vscode.Uri.file(storeRootReducerPath),
    Buffer.from(storeRootReducerLines.join("\n")),
  );

  await vscode.workspace.save(vscode.Uri.file(storeRootReducerPath));
};
