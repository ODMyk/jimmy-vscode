import * as vscode from "vscode";
import {bindings} from "./commands";

export function activate(context: vscode.ExtensionContext) {
  bindings.forEach((binding) => {
    const disposable = vscode.commands.registerCommand(
      binding.command,
      binding.callback,
    );

    context.subscriptions.push(disposable);
  });
}

export function deactivate() {}
