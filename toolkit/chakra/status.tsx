import { Status as ChakraStatus } from '@chakra-ui/react';
import * as React from 'react';

export interface StatusProps extends ChakraStatus.RootProps {}

export const Status = React.forwardRef<HTMLDivElement, StatusProps>(
  function Status(props, ref) {
    return (
      <ChakraStatus.Root ref={ ref } { ...props }/>
    );
  },
);
