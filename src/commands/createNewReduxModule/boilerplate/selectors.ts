import {MODULE_NAME_UNCAPITALIZED_PLACEHOLDER} from "../../../constants/placeholders";

export const SELECTORS_CONTENT = `import {createSelector} from '@reduxjs/toolkit';
import {RootState} from '@store/rootReducer';

const selectModule = (state: RootState) => state.${MODULE_NAME_UNCAPITALIZED_PLACEHOLDER};

export const templateFieldSelector = createSelector(
  selectModule,
  state => state.templateField,
);
`;
