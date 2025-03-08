import {
  MODULE_NAME_PLACEHOLDER,
  MODULE_NAME_UNCAPITALIZED_PLACEHOLDER,
} from "../../../constants/placeholders";

export const REDUCER_IMPORT_LINE = `import {${MODULE_NAME_UNCAPITALIZED_PLACEHOLDER}Reducer} from '@store/modules/${MODULE_NAME_PLACEHOLDER}/reducer';`;

export const REDUCER_REGISTER_LINE_SEARCH =
  "export const rootReducer = combineReducers({";

export const REDUCER_REGISTER_LINE_REPLACE = `export const rootReducer = combineReducers({${MODULE_NAME_UNCAPITALIZED_PLACEHOLDER}: ${MODULE_NAME_UNCAPITALIZED_PLACEHOLDER}Reducer,`;
