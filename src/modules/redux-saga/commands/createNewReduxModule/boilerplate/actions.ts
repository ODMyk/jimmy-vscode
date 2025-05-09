import {MODULE_NAME_PLACEHOLDER} from "../../../constants/placeholders";

export const ACTIONS_CONTENT = `import {createAction} from '@store/utils/actions/createAction';

const ACTION_SAMPLE = createAction('ACTION_SAMPLE', {
  START: () => {},
  SUCCESS: () => {},
});

export const ${MODULE_NAME_PLACEHOLDER}Actions = Object.freeze({
  ACTION_SAMPLE,
});
`;
