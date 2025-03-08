import {
  ACTION_NAME_PLACEHOLDER,
  MODULE_NAME_PLACEHOLDER,
  SAGA_NAME_PLACEHOLDER,
} from "../../../constants/placeholders";

export const SAGA_IMPORT_LINE = `import {${SAGA_NAME_PLACEHOLDER}} from './${SAGA_NAME_PLACEHOLDER}';`;

export const SAGA_REGISTER_LINE_SEARCH = "yield all([";

export const SAGA_REGISTER_LINE_REPLACE = `yield all([takeLatest(${MODULE_NAME_PLACEHOLDER}Actions.${ACTION_NAME_PLACEHOLDER}.START.type, ${SAGA_NAME_PLACEHOLDER}),`;
