import { Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const AvailableSoonLabel = () => (
  <Flex
    px={ 1 }
    borderRadius="sm"
    backgroundColor={ useColorModeValue('blue.50', 'blue.800') }
    color={ useColorModeValue('blue.500', 'blue.100') }
    fontSize="sm"
    fontWeight="500"
    h={ 6 }
    alignItems="center"
  >
    Available soon
  </Flex>
);

export default AvailableSoonLabel;
