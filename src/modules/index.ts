import {bindings as reduxSagaCommands} from "./redux-saga/commands";
import {
  bindings as reactNativeCommands,
  snippets as reactNativeSnippets,
} from "./react-native";
import {Modules} from "../extension";

export interface Snippet {
  prefix: string;
  body: string;
  description: string;
}

export const commands = [...reactNativeCommands, ...reduxSagaCommands];

export const getSnippetsForModule = (module: Modules): Snippet[] => {
  switch (module) {
    case Modules.REACT_NATIVE:
      return reactNativeSnippets;
    case Modules.REDUX_SAGA:
      return [];
    case Modules.REACT:
      return [];
    default:
      const exhaustiveCheck: never = module;
      console.log(exhaustiveCheck);
      return [];
  }
};
