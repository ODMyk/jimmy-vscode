import {MODULE_NAME_PLACEHOLDER} from "../../../constants/placeholders";

export const ROOT_SAGA_CONTENT = `import {${MODULE_NAME_PLACEHOLDER}Actions} from '@store/modules/${MODULE_NAME_PLACEHOLDER}/actions';
import {all, takeLatest} from 'redux-saga/effects';

import {templateSaga} from './templateSaga';

export function* root${MODULE_NAME_PLACEHOLDER}Saga() {
  yield all([takeLatest(${MODULE_NAME_PLACEHOLDER}Actions.ACTION_SAMPLE.START.type, templateSaga)]);
}
`;
