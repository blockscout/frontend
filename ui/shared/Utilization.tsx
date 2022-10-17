import { Box, Flex, Text, chakra, useColorModeValue } from '@chakra-ui/react';
import clamp from 'lodash/clamp';
import React from 'react';

interface Props {
  className?: string;
  value: number;
  colorScheme?: 'green' | 'gray';
}

const WIDTH = 50;

const Utilization = ({ className, value, colorScheme = 'green' }: Props) => {
  const valueString = (clamp(value * 100, 0, 100)).toLocaleString('en', { maximumFractionDigits: 2 }) + '%';
  const colorGrayScheme = useColorModeValue('gray.500', 'gray.500');
  const color = colorScheme === 'gray' ? colorGrayScheme : 'green.500';

  return (
    <Flex className={ className } alignItems="center">
      <Box bg={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') } w={ `${ WIDTH }px` } h="4px" borderRadius="full" overflow="hidden">
        <Box bg={ color } w={ valueString } h="100%"/>
      </Box>
      <Text color={ color } ml="10px" fontWeight="bold">{ valueString }</Text>
    </Flex>
  );
};

export default chakra(Utilization);
