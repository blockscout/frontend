import { chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

const COUNTER_OVERLOAD = 50;

type Props = {
  count?: number | null;
  isActive?: boolean;
}

const TabCounter = ({ count, isActive }: Props) => {

  const zeroCountColor = useColorModeValue('blackAlpha.400', 'whiteAlpha.400');
  const nonZeroCountColor = useColorModeValue('text_secondary', 'text_secondary');

  const activeZeroColor = isActive ? 'gray.50' : zeroCountColor;
  const activeNonZeroColor = isActive ? 'white' : nonZeroCountColor;

  if (count === undefined || count === null) {
    return null;
  }

  return (
    <chakra.span
      color={ count > 0 ? activeNonZeroColor : activeZeroColor }
      ml={ 1 }
      fontSize="sm"
      { ...getDefaultTransitionProps() }
    >
      { count > COUNTER_OVERLOAD ? `${ COUNTER_OVERLOAD }+` : count }
    </chakra.span>
  );
};

export default TabCounter;
