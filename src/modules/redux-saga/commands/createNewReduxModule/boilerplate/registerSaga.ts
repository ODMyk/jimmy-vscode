import {MODULE_NAME_PLACEHOLDER} from "../../../constants/placeholders";

export const SAGA_IMPORT_LINE = `import {root${MODULE_NAME_PLACEHOLDER}Saga} from '@store/modules/${MODULE_NAME_PLACEHOLDER}/sagas';`;

export const SAGA_REGISTER_LINE_SEARCH = "const sagas: Saga[] = [";

export const SAGA_REGISTER_LINE_REPLACE = `const sagas: Saga[] = [root${MODULE_NAME_PLACEHOLDER}Saga,`;
