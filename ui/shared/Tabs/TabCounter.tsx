import { chakra } from '@chakra-ui/react';
import React from 'react';

const COUNTER_OVERLOAD = 50;

type Props = {
  count?: number | null;
};

// TODO @tom2drum remove this
const TabCounter = ({ count }: Props) => {
  if (count === undefined || count === null) {
    return null;
  }

  return (
    <chakra.span
      color={ count > 0 ? 'text.secondary' : { _light: 'blackAlpha.400', _dark: 'whiteAlpha.400' } }
      ml={ 1 }
    >
      { count > COUNTER_OVERLOAD ? `${ COUNTER_OVERLOAD }+` : count }
    </chakra.span>
  );
};

export default TabCounter;
