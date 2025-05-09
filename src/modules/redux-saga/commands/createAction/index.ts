import {existsSync} from "fs";
import path from "path";
import * as vscode from "vscode";
import {formatBoilerplate} from "../../utils/boilerplateFormatter";
import {
  ACTION_CREATE,
  ACTION_REGISTER_REPLACE,
  ACTION_REGISTER_SEARCH,
  SAGA_IMPORT_LINE,
  SAGA_REGISTER_LINE_REPLACE,
  SAGA_REGISTER_LINE_SEARCH,
  TEMPLATE_SAGA_CONTENT,
} from "./boilerplate";

export const createAction = async () => {
  if (
    !vscode.workspace.workspaceFolders ||
    vscode.workspace.workspaceFolders.length === 0
  ) {
    vscode.window.showErrorMessage("No workspace folder found.");
    return;
  }
  const projectRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
  const storeFolder = path.join(projectRoot, "src", "store");
  const modulesPath = path.join(storeFolder, "modules");
  const modules = (
    await vscode.workspace.fs.readDirectory(vscode.Uri.file(modulesPath))
  ).map(([name]) => name);

  if (modules.length === 0) {
    await vscode.window.showErrorMessage("No module found.");
    return;
  }

  if (!existsSync(storeFolder)) {
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

  const actionsPath = path.join(modulePath, "actions", "index.ts");

  const actionName = await vscode.window.showInputBox({
    prompt: "Enter the action name",
    placeHolder: "ACTION",
    validateInput: (text) => {
      const trimmedText = text.trim();
      if (trimmedText.length === 0) {
        return "Action name cannot be empty";
      }
      if (!trimmedText.match(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/)) {
        return "Action name must be a valid js-function name";
      }
      return undefined;
    },
  });

  if (!actionName) {
    return;
  }

  const actionsFile = await vscode.workspace.fs.readFile(
    vscode.Uri.file(actionsPath),
  );
  const actionsLines = actionsFile.toString().split("\n");
  if (actionsLines.some((line) => line.includes(actionName))) {
    await vscode.window.showErrorMessage("Action already exists.");
    return;
  }

  const {label: shouldCreateSagaAnswer} = (await vscode.window.showQuickPick(
    [{label: "Yes"}, {label: "No"}],
    {
      placeHolder: "Do you want to create saga for this action ?",
      matchOnDetail: true,
      ignoreFocusOut: true,
    },
  )) ?? {label: undefined};

  if (!shouldCreateSagaAnswer) {
    return;
  }

  const shouldCreateSaga = shouldCreateSagaAnswer === "Yes";

  const actionLineIndex = actionsLines.findIndex((line) =>
    line.includes(ACTION_REGISTER_SEARCH),
  );

  actionsLines[actionLineIndex] = actionsLines[actionLineIndex].replace(
    ACTION_REGISTER_SEARCH,
    formatBoilerplate(ACTION_REGISTER_REPLACE, {
      actionName,
    }),
  );

  actionsLines.splice(
    actionLineIndex - 1,
    0,
    formatBoilerplate(ACTION_CREATE, {actionName}),
  );

  await vscode.workspace.fs.writeFile(
    vscode.Uri.file(actionsPath),
    Buffer.from(actionsLines.join("\n")),
  );

  if (shouldCreateSaga) {
    const sagaNameCapitalized = `${actionName
      .split("_")
      .map((word) => word[0].toUpperCase() + word.slice(1).toLocaleLowerCase())
      .join("")}Saga`;
    const sagaName =
      sagaNameCapitalized[0].toLowerCase() + sagaNameCapitalized.slice(1);

    const sagasFolderPath = path.join(modulePath, "sagas");
    const rootSagaPath = path.join(sagasFolderPath, "index.ts");
    const newSagaPath = path.join(sagasFolderPath, `${sagaName}.ts`);

    await vscode.workspace.fs.writeFile(
      vscode.Uri.file(newSagaPath),
      Buffer.from(
        formatBoilerplate(TEMPLATE_SAGA_CONTENT, {
          moduleName,
          actionName,
          sagaName,
        }),
      ),
    );

    const rootSagaFile = await vscode.workspace.fs.readFile(
      vscode.Uri.file(rootSagaPath),
    );
    const rootSagaLines = rootSagaFile.toString().split("\n");
    rootSagaLines.unshift(formatBoilerplate(SAGA_IMPORT_LINE, {sagaName}));
    const rootSagaLine = rootSagaLines.findIndex((line) =>
      line.includes(SAGA_REGISTER_LINE_SEARCH),
    );
    rootSagaLines[rootSagaLine] = rootSagaLines[rootSagaLine].replace(
      SAGA_REGISTER_LINE_SEARCH,
      formatBoilerplate(SAGA_REGISTER_LINE_REPLACE, {
        sagaName,
        actionName,
        moduleName,
      }),
    );

    await vscode.workspace.fs.writeFile(
      vscode.Uri.file(rootSagaPath),
      Buffer.from(rootSagaLines.join("\n")),
    );
  }
};
