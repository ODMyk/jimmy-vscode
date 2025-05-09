import {bindings as reduxSagaBindings} from "./redux-saga/commands";
import {bindings as reactNativeBindings} from "./react-native/commands";
import {Modules} from "../extension";

interface ModuleBindings {
  module: Modules;
  bindings: Binding[];
}

interface Binding {
  command: string;
  callback: (...args: any[]) => any;
}

export const bindings: readonly ModuleBindings[] = Object.freeze([
  {
    module: Modules.ReduxSaga,
    bindings: reduxSagaBindings,
  },
  {
    module: Modules.ReactNative,
    bindings: reactNativeBindings,
  },
]);
