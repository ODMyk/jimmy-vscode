import vscode from "vscode";
import {commands, getSnippetsForModule} from "./modules";
import pkg from "../package.json";

export const EXTENSION_NAME = pkg.name;

export enum Modules {
  REACT_NATIVE = "react-native",
  REDUX_SAGA = "redux-saga",
  REACT = "react",
}

export const allModules = Object.freeze(Object.values(Modules));

interface ModulePickerEntry {
  label: string;
  module: Modules;
}

const pickerOptions: ModulePickerEntry[] = [
  {
    label: "React Native",
    module: Modules.REACT_NATIVE,
  },
  {
    label: "Redux Saga",
    module: Modules.REDUX_SAGA,
  },
  {
    label: "React",
    module: Modules.REACT,
  },
];

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration(EXTENSION_NAME);

  const includedModules = allModules.filter((module) =>
    config.get<boolean>(`${module}.enabled`),
  );

  function updateSnippetProviders(includedModules: Modules[]) {
    context.subscriptions.forEach((sub, i) => {
      if ((sub as any).__isSnippetProvider) {
        sub.dispose();
        context.subscriptions.splice(i, 1);
      }
    });
    for (const moduleName of includedModules) {
      const moduleSnippets = getSnippetsForModule(moduleName);
      if (moduleSnippets === undefined || moduleSnippets.length === 0) {
        continue;
      }
      const provider = vscode.languages.registerCompletionItemProvider(
        {scheme: "file", language: "typescript"},
        {
          provideCompletionItems(document, position) {
            const linePrefix = document
              .lineAt(position)
              .text.substring(0, position.character);
            const wordRange = document.getWordRangeAtPosition(position);
            const currentWord = wordRange ? document.getText(wordRange) : "";

            return moduleSnippets.map((snippet) => {
              const item = new vscode.CompletionItem(
                snippet.prefix,
                vscode.CompletionItemKind.Snippet,
              );
              item.insertText = new vscode.SnippetString(snippet.body);
              item.detail = snippet.description;

              item.filterText = snippet.prefix;

              item.sortText = "0" + snippet.prefix;

              return item;
            });
          },
        },
        ".",
      );
      (provider as any).__isSnippetProvider = true;
      context.subscriptions.push(provider);
    }
  }

  const mainDisposable = vscode.commands.registerCommand(
    `${EXTENSION_NAME}.selectModules`,
    async () => {
      const selected = await vscode.window.showQuickPick(
        pickerOptions.map((option) => ({
          label: option.label,
          picked: includedModules.includes(option.module),
        })),
        {canPickMany: true, placeHolder: "Select modules"},
      );

      if (!selected) {
        return;
      }

      pickerOptions.forEach(async (option) => {
        const enabled = selected.some((s) => s.label === option.label);
        await config.update(
          `${option.module}.enabled`,
          enabled,
          vscode.ConfigurationTarget.Workspace,
        );
        await vscode.commands.executeCommand(
          "setContext",
          `${EXTENSION_NAME}.${option.module}.enabled`,
          enabled,
        );
      });

      updateSnippetProviders(
        selected.map(
          (s) => pickerOptions.find((o) => o.label === s.label)!.module,
        ),
      );
    },
  );

  allModules.forEach(async (module) => {
    await vscode.commands.executeCommand(
      "setContext",
      `${EXTENSION_NAME}.${module}.enabled`,
      includedModules.includes(module),
    );
  });

  updateSnippetProviders(includedModules);

  context.subscriptions.push(mainDisposable);

  commands.forEach((binding) => {
    const disposable = vscode.commands.registerCommand(
      binding.command,
      binding.callback,
    );

    context.subscriptions.push(disposable);
  });
}

export function deactivate() {}
