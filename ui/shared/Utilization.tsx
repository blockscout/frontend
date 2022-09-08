import { Box, Flex, Text, chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  className?: string;
  value: number;
}

const WIDTH = 50;

const Utilization = ({ className, value }: Props) => {
  const valueString = (value * 100).toFixed(2) + '%';
  return (
    <Flex className={ className } alignItems="center">
      <Box bg="gray.100" w={ `${ WIDTH }px` } h="4px" borderRadius="full" overflow="hidden">
        <Box bg="green.500" w={ valueString } h="100%"/>
      </Box>
      <Text color="green.500" ml="10px" fontWeight="bold">{ valueString }</Text>
    </Flex>
  );
};

export default chakra(Utilization);
