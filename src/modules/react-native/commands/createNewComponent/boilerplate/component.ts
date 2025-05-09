import {COMPONENT_NAME_PLACEHOLDER} from "../../../constants/placeholders";

export const COMPONENT_CONTENT = `import React from 'react';

import {useStyles} from './styles';

export function ${COMPONENT_NAME_PLACEHOLDER}() {
    const styles = useStyles();

    return (
        <>
        </>
    );
}
`;
