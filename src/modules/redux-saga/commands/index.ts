import {createAction} from "./createAction";
import {createNewReduxModule} from "./createNewReduxModule";
import {createReducer} from "./createReducer";
import {extensionName} from "../../../extension";

export const bindings = [
  {
    command: `${extensionName}.createNewReduxModule`,
    callback: createNewReduxModule,
  },
  {
    command: `${extensionName}.createReducer`,
    callback: createReducer,
  },
  {
    command: `${extensionName}.createAction`,
    callback: createAction,
  },
];
