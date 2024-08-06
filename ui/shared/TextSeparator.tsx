import { chakra } from '@chakra-ui/react';
import type { StyleProps } from '@chakra-ui/styled-system';
import React from 'react';

import colors from 'theme/foundations/colors';

const TextSeparator = ({ id, ...props }: StyleProps & { id?: string }) => {
  return <chakra.span mx={ 3 } id={ id } color={ colors.grayTrue[700] } { ...props }>|</chakra.span>;
};

export default React.memo(TextSeparator);
