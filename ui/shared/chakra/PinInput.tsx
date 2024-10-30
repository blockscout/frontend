import type { PinInputProps, StyleProps } from '@chakra-ui/react';
// eslint-disable-next-line no-restricted-imports
import { PinInput as PinInputBase } from '@chakra-ui/react';
import React from 'react';

const PinInput = (props: PinInputProps & { bgColor?: StyleProps['bgColor'] }) => {
  return <PinInputBase { ...props }/>;
};

export default React.memo(PinInput);
