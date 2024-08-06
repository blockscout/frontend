import { chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import colors from 'theme/foundations/colors';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

const COUNTER_OVERLOAD = 50;

type Props = {
  count?: number | null;
}

const TabCounter = ({ count }: Props) => {

  const zeroCountColor = useColorModeValue('blackAlpha.400', colors.grayTrue[500]); //'whiteAlpha.400'

  if (count === undefined || count === null) {
    return null;
  }

  return (
    <chakra.span
      color={ count > 0 ? colors.error[400] : zeroCountColor } //'text_secondary'
      ml={ 1 }
      { ...getDefaultTransitionProps() }
    >
      { count > COUNTER_OVERLOAD ? `${ COUNTER_OVERLOAD }+` : count }
    </chakra.span>
  );
};

export default TabCounter;
