import {createAction} from "./createAction";
import {createNewComponent} from "./createNewComponent";
import {createNewReduxModule} from "./createNewReduxModule";
import {createReducer} from "./createReducer";

export const bindings = [
  {
    command: "react-native-tenty.createNewComponent",
    callback: createNewComponent,
  },
  {
    command: "react-native-tenty.createNewReduxModule",
    callback: createNewReduxModule,
  },
  {
    command: "react-native-tenty.createReducer",
    callback: createReducer,
  },
  {
    command: "react-native-tenty.createAction",
    callback: createAction,
  },
];
