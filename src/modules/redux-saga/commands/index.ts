import {createAction} from "./createAction";
import {createNewReduxModule} from "./createNewReduxModule";
import {createReducer} from "./createReducer";
import {EXTENSION_NAME} from "../../../extension";

export const bindings = [
  {
    command: `${EXTENSION_NAME}.createNewReduxModule`,
    callback: createNewReduxModule,
  },
  {
    command: `${EXTENSION_NAME}.createReducer`,
    callback: createReducer,
  },
  {
    command: `${EXTENSION_NAME}.createAction`,
    callback: createAction,
  },
];
