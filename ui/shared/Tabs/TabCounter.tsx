import type { SystemStyleObject } from '@chakra-ui/react';
import { Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

type Props = {
  count?: number;
  parentClassName: string;
}

const TasCounter = ({ count, parentClassName }: Props) => {

  const zeroCountColor = useColorModeValue('blackAlpha.400', 'whiteAlpha.400');

  if (count === undefined) {
    return null;
  }

  const sx: SystemStyleObject = {};
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore:
  sx[`.${ parentClassName }:hover &`] = { color: 'inherit' };

  return (
    <Text
      color={ count > 0 ? 'text_secondary' : zeroCountColor }
      ml={ 1 }
      sx={ sx }
      transitionProperty="color"
      transitionDuration="normal"
      transitionTimingFunction="ease"
    >
      { count }
    </Text>
  );
};

export default TasCounter;
