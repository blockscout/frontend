import type { PopoverProps } from '@chakra-ui/react';
// eslint-disable-next-line no-restricted-imports
import { Popover as PopoverBase } from '@chakra-ui/react';
import React from 'react';

const Popover = (props: PopoverProps) => {
  return <PopoverBase gutter={ 4 } { ...props }/>;
};

export default React.memo(Popover);
