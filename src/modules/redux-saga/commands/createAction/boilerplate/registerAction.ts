import {ACTION_NAME_PLACEHOLDER} from "../../../constants/placeholders";

export const ACTION_CREATE = `
const ${ACTION_NAME_PLACEHOLDER} = createAction('${ACTION_NAME_PLACEHOLDER}', {
  START: () => {},
  SUCCESS: () => {},
});
`;

export const ACTION_REGISTER_SEARCH = "Actions = Object.freeze({";

export const ACTION_REGISTER_REPLACE = `Actions = Object.freeze({
  ${ACTION_NAME_PLACEHOLDER},`;
