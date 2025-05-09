import {COMPONENT_NAME_PLACEHOLDER} from "../constants/placeholders";

export const formatBoilerplate = (
  boilerplate: string,
  options: {
    componentName?: string;
  },
) => {
  let formattedBoilerplate = boilerplate;
  if (options.componentName) {
    formattedBoilerplate = formattedBoilerplate.replaceAll(
      COMPONENT_NAME_PLACEHOLDER,
      options.componentName,
    );
  }
  return formattedBoilerplate;
};
