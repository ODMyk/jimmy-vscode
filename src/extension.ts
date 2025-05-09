import * as vscode from "vscode";
import {bindings} from "./modules";

export const extensionName = "react-native-tenty";

export enum Modules {
  ReactNative = "react-native",
  ReduxSaga = "redux-saga",
  React = "react",
}

const modules = Object.values(Modules);

type ModulePickerEntry = {
  label: string;
  module: Modules;
};

const pickerOptions: ModulePickerEntry[] = [
  {
    label: "React Native",
    module: Modules.ReactNative,
  },
  {
    label: "Redux Saga",
    module: Modules.ReduxSaga,
  },
  {
    label: "React",
    module: Modules.React,
  },
];

export async function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration(extensionName);

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `${extensionName}.selectModules`,
      async () => {
        const selected = await vscode.window.showQuickPick(
          pickerOptions.map((option) => option.label),
          {canPickMany: true, placeHolder: "Select modules"},
        );

        selected &&
          pickerOptions.forEach(async (option) => {
            const enabled = selected.includes(option.label);
            await config.update(
              `${option.module}.enabled`,
              enabled,
              vscode.ConfigurationTarget.Workspace,
            );
            await vscode.commands.executeCommand(
              "setContext",
              `${extensionName}.${option.module}.enabled`,
              enabled,
            );
          });
      },
    ),
  );

  modules.forEach(async (module) => {
    await vscode.commands.executeCommand(
      "setContext",
      `${extensionName}.${module}.enabled`,
      config.get<boolean>(`${module}.enabled`),
    );
  });

  const includedModules = modules.filter((module) =>
    config.get<boolean>(`${module}.enabled`),
  );

  const includedBindings = bindings
    .filter((binding) => {
      return includedModules.includes(binding.module);
    })
    .map((binding) => binding.bindings)
    .flat();

  includedBindings.forEach((binding) => {
    const disposable = vscode.commands.registerCommand(
      binding.command,
      binding.callback,
    );

    context.subscriptions.push(disposable);
  });
}

export function deactivate() {}
