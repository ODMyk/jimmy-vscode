import {createNewComponent} from "./createNewComponent";
import {EXTENSION_NAME} from "../../../extension";

export const bindings = [
  {
    command: `${EXTENSION_NAME}.createNewComponent`,
    callback: createNewComponent,
  },
];
