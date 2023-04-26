import { Box, Flex, Text, chakra, useColorModeValue, Skeleton } from '@chakra-ui/react';
import clamp from 'lodash/clamp';
import React from 'react';

interface Props {
  className?: string;
  value: number;
  colorScheme?: 'green' | 'gray';
  isLoading?: boolean;
}

const WIDTH = 50;

const Utilization = ({ className, value, colorScheme = 'green', isLoading }: Props) => {
  const valueString = (clamp(value * 100 || 0, 0, 100)).toLocaleString(undefined, { maximumFractionDigits: 2 }) + '%';
  const colorGrayScheme = useColorModeValue('gray.500', 'gray.400');
  const color = colorScheme === 'gray' ? colorGrayScheme : 'green.500';

  return (
    <Flex className={ className } alignItems="center" columnGap="10px">
      <Skeleton isLoaded={ !isLoading }>
        <Box bg={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') } w={ `${ WIDTH }px` } h="4px" borderRadius="full" overflow="hidden">
          <Box bg={ color } w={ valueString } h="100%"/>
        </Box>
      </Skeleton>
      <Skeleton isLoaded={ !isLoading }>
        <Text color={ color } fontWeight="bold">{ valueString }</Text>
      </Skeleton>
    </Flex>
  );
};

export default React.memo(chakra(Utilization));
