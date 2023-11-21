import type { SystemStyleObject } from '@chakra-ui/react';
import { Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const COUNTER_OVERLOAD = 50;

type Props = {
  count?: number | null;
  parentClassName: string;
}

const TabCounter = ({ count, parentClassName }: Props) => {

  const zeroCountColor = useColorModeValue('blackAlpha.400', 'whiteAlpha.400');

  if (count === undefined || count === null) {
    return null;
  }

  const sx: SystemStyleObject = {
    [`.${ parentClassName }:hover &`]: { color: 'inherit' },
  };

  return (
    <Text
      color={ count > 0 ? 'text_secondary' : zeroCountColor }
      ml={ 1 }
      sx={ sx }
      transitionProperty="color"
      transitionDuration="normal"
      transitionTimingFunction="ease"
    >
      { count > COUNTER_OVERLOAD ? `${ COUNTER_OVERLOAD }+` : count }
    </Text>
  );
};

export default TabCounter;
