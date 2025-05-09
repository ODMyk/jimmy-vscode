import {existsSync} from "fs";
import path from "path";
import * as vscode from "vscode";
import {formatBoilerplate} from "../../utils/boilerplateFormatter";
import {
  ACTIONS_CONTENT,
  REDUCER_CONTENT,
  REDUCER_IMPORT_LINE,
  REDUCER_REGISTER_LINE_REPLACE,
  REDUCER_REGISTER_LINE_SEARCH,
  SAGA_IMPORT_LINE,
  SAGA_REGISTER_LINE_REPLACE,
  SAGA_REGISTER_LINE_SEARCH,
  SELECTORS_CONTENT,
  TEMPLATE_SAGA_CONTENT,
  ROOT_SAGA_CONTENT,
} from "./boilerplate";

export const createNewReduxModule = async () => {
  if (
    !vscode.workspace.workspaceFolders ||
    vscode.workspace.workspaceFolders.length === 0
  ) {
    vscode.window.showErrorMessage("No workspace folder found.");
    return;
  }

  const projectRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
  const storeFolder = path.join(projectRoot, "src", "store");
  const storeRootSagaPath = path.join(storeFolder, "rootSaga.ts");
  const storeRootReducerPath = path.join(storeFolder, "rootReducer.ts");

  if (
    !existsSync(storeFolder) ||
    !existsSync(storeRootSagaPath) ||
    !existsSync(storeRootReducerPath)
  ) {
    await vscode.window.showErrorMessage("Store is invalid.");
    return;
  }

  const moduleName = await vscode.window.showInputBox({
    prompt: "Enter the module name",
    placeHolder: "Module",
    validateInput: (text) => {
      const trimmedText = text.trim();
      if (trimmedText.length === 0) {
        return "Module name cannot be empty";
      }
      if (!trimmedText.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/)) {
        return "Module name must be a valid js-function name";
      }
      return null;
    },
  });

  if (!moduleName) {
    return;
  }

  const {label: createReducerAndSelectorsAnswer} =
    (await vscode.window.showQuickPick([{label: "Yes"}, {label: "No"}], {
      placeHolder: "Do you want to create reducer and selectors ?",
      matchOnDetail: true,
      ignoreFocusOut: true,
    })) ?? {label: undefined};

  if (!createReducerAndSelectorsAnswer) {
    return;
  }

  const createReducerAndSelectors = createReducerAndSelectorsAnswer === "Yes";

  const modulePath = path.join(
    projectRoot,
    "src",
    "store",
    "modules",
    moduleName,
  );

  const actionsFolderPath = path.join(modulePath, "actions");
  const actionsPath = path.join(actionsFolderPath, "index.ts");

  const sagasFolderPath = path.join(modulePath, "sagas");
  const rootSagaPath = path.join(sagasFolderPath, "index.ts");
  const templateSagaPath = path.join(sagasFolderPath, "templateSaga.ts");

  const reducerFolderPath = path.join(modulePath, "reducer");
  const reducerPath = path.join(reducerFolderPath, "index.ts");

  const selectorsFolderPath = path.join(modulePath, "selectors");
  const selectorsPath = path.join(selectorsFolderPath, "index.ts");

  if (existsSync(modulePath)) {
    vscode.window.showErrorMessage("Module already exists.");
    return;
  }

  await vscode.workspace.fs.createDirectory(vscode.Uri.file(modulePath));

  await vscode.workspace.fs.createDirectory(vscode.Uri.file(actionsFolderPath));
  await vscode.workspace.fs.writeFile(
    vscode.Uri.file(actionsPath),
    Buffer.from(formatBoilerplate(ACTIONS_CONTENT, {moduleName})),
  );

  await vscode.workspace.fs.createDirectory(vscode.Uri.file(sagasFolderPath));
  await vscode.workspace.fs.writeFile(
    vscode.Uri.file(rootSagaPath),
    Buffer.from(formatBoilerplate(ROOT_SAGA_CONTENT, {moduleName})),
  );
  await vscode.workspace.fs.writeFile(
    vscode.Uri.file(templateSagaPath),
    Buffer.from(formatBoilerplate(TEMPLATE_SAGA_CONTENT, {moduleName})),
  );

  const storeRootSagaFile = await vscode.workspace.fs.readFile(
    vscode.Uri.file(storeRootSagaPath),
  );

  const storeRootSagaLines = storeRootSagaFile.toString().split("\n");
  storeRootSagaLines.unshift(formatBoilerplate(SAGA_IMPORT_LINE, {moduleName}));
  const lineIndex = storeRootSagaLines.findIndex((line) =>
    line.includes(SAGA_REGISTER_LINE_SEARCH),
  );

  storeRootSagaLines[lineIndex] = storeRootSagaLines[lineIndex].replace(
    SAGA_REGISTER_LINE_SEARCH,
    formatBoilerplate(SAGA_REGISTER_LINE_REPLACE, {moduleName}),
  );

  await vscode.workspace.fs.writeFile(
    vscode.Uri.file(storeRootSagaPath),
    Buffer.from(storeRootSagaLines.join("\n")),
  );

  await vscode.workspace.save(vscode.Uri.file(storeRootSagaPath));

  if (createReducerAndSelectors) {
    await vscode.workspace.fs.createDirectory(
      vscode.Uri.file(reducerFolderPath),
    );
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
  }
};
