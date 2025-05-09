import {createNewComponent} from "./createNewComponent";
import {extensionName} from "../../../extension";

export const bindings = [
  {
    command: `${extensionName}.createNewComponent`,
    callback: createNewComponent,
  },
];
