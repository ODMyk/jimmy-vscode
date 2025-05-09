import {
  ACTION_NAME_PLACEHOLDER,
  MODULE_NAME_PLACEHOLDER,
  MODULE_NAME_UNCAPITALIZED_PLACEHOLDER,
  SAGA_NAME_PLACEHOLDER,
} from "../constants/placeholders";

export const formatBoilerplate = (
  boilerplate: string,
  options: {
    moduleName?: string;
    actionName?: string;
    sagaName?: string;
  },
) => {
  let formattedBoilerplate = boilerplate;
  if (options.moduleName) {
    formattedBoilerplate = formattedBoilerplate.replaceAll(
      MODULE_NAME_PLACEHOLDER,
      options.moduleName,
    );
    formattedBoilerplate = formattedBoilerplate.replaceAll(
      MODULE_NAME_UNCAPITALIZED_PLACEHOLDER,
      options.moduleName.charAt(0).toLowerCase() + options.moduleName.slice(1),
    );
  }
  if (options.actionName) {
    formattedBoilerplate = formattedBoilerplate.replaceAll(
      ACTION_NAME_PLACEHOLDER,
      options.actionName,
    );
  }
  if (options.sagaName) {
    formattedBoilerplate = formattedBoilerplate.replaceAll(
      SAGA_NAME_PLACEHOLDER,
      options.sagaName,
    );
  }
  return formattedBoilerplate;
};
