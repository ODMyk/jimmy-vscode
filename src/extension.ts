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

function getIncludedModules() {
  const config = vscode.workspace.getConfiguration(EXTENSION_NAME);
  return allModules.filter((module) =>
    config.get<boolean>(`${module}.enabled`),
  );
}

function registerCommands(context: vscode.ExtensionContext) {
  for (const command of commands) {
    context.subscriptions.push(
      vscode.commands.registerCommand(command.command, command.callback),
    );
  }
  context.subscriptions.push(
    vscode.commands.registerCommand(
      `${EXTENSION_NAME}.selectModules`,
      selectModules,
    ),
  );
}

function onConfigurationChanged(context: vscode.ExtensionContext) {
  const includedModules = getIncludedModules();
  updateSnippetProviders(context, includedModules);
  updateCommandsContext(includedModules);
}
function updateSnippetProviders(
  context: vscode.ExtensionContext,
  includedModules: Modules[],
) {
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
        provideCompletionItems() {
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

async function updateCommandsContext(includedModules: Modules[]) {
  for (const module of allModules) {
    await vscode.commands.executeCommand(
      "setContext",
      `${EXTENSION_NAME}.${module}.enabled`,
      includedModules.includes(module),
    );
  }
}

async function selectModules() {
  const config = vscode.workspace.getConfiguration(EXTENSION_NAME);
  const includedModules = getIncludedModules();
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
  });
}

export function activate(context: vscode.ExtensionContext) {
  onConfigurationChanged(context);
  registerCommands(context);

  const disposable = vscode.workspace.onDidChangeConfiguration(() =>
    onConfigurationChanged(context),
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
