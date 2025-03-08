import {
  MODULE_NAME_PLACEHOLDER,
  MODULE_NAME_UNCAPITALIZED_PLACEHOLDER,
} from "../../../constants/placeholders";

export const REDUCER_CONTENT = `import {${MODULE_NAME_PLACEHOLDER}Actions} from '@store/modules/${MODULE_NAME_PLACEHOLDER}/actions';
import {produce} from 'immer';

interface ${MODULE_NAME_PLACEHOLDER}State {
  templateField: number;
}

const INITIAL_STATE: ${MODULE_NAME_PLACEHOLDER}State = {
  templateField: 0,
};

type Actions = ReturnType<typeof ${MODULE_NAME_PLACEHOLDER}Actions.ACTION_SAMPLE.START.create>;

export function ${MODULE_NAME_UNCAPITALIZED_PLACEHOLDER}Reducer(
  state = INITIAL_STATE,
  action: Actions,
): ${MODULE_NAME_PLACEHOLDER}State {
  return produce(state, draft => {
    switch (action.type) {
      case ${MODULE_NAME_PLACEHOLDER}Actions.ACTION_SAMPLE.START.type:
        draft.templateField = 1;
        break;
    }
  });
}
`;
