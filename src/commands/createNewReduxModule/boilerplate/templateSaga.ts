import {MODULE_NAME_PLACEHOLDER} from "../../../constants/placeholders";

export const TEMPLATE_SAGA_CONTENT = `import {${MODULE_NAME_PLACEHOLDER}Actions} from '@store/modules/${MODULE_NAME_PLACEHOLDER}/actions';
import {getErrorMessage} from '@store/utils/errors';
import {put} from 'redux-saga/effects';

const actionCreate = ${MODULE_NAME_PLACEHOLDER}Actions.ACTION_SAMPLE.START.create;

export function* templateSaga({}: ReturnType<typeof actionCreate>) {
  try {
    yield put(${MODULE_NAME_PLACEHOLDER}Actions.ACTION_SAMPLE.SUCCESS.create());
  } catch (error) {
    yield put(
      ${MODULE_NAME_PLACEHOLDER}Actions.ACTION_SAMPLE.FAILED.create({
        errorMessage: getErrorMessage(error),
      }),
    );
  }
}
`;
