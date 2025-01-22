import { Box, Flex, chakra } from '@chakra-ui/react';
import { clamp } from 'es-toolkit';
import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';

interface Props {
  className?: string;
  value: number;
  colorScheme?: 'green' | 'gray';
  isLoading?: boolean;
}

const WIDTH = 50;

const Utilization = ({ className, value, colorScheme = 'green', isLoading }: Props) => {
  const valueString = (clamp(value * 100 || 0, 0, 100)).toLocaleString(undefined, { maximumFractionDigits: 2 }) + '%';
  const colorGrayScheme = { _light: 'gray.500', _dark: 'gray.400' };
  const color = colorScheme === 'gray' ? colorGrayScheme : 'green.500';

  return (
    <Flex className={ className } alignItems="center" columnGap={ 2 }>
      <Skeleton loading={ isLoading } w={ `${ WIDTH }px` } h="4px" borderRadius="full" overflow="hidden">
        <Box bg={{ _light: 'blackAlpha.200', _dark: 'whiteAlpha.200' }} h="100%">
          <Box bg={ color } w={ valueString } h="100%"/>
        </Box>
      </Skeleton>
      <Skeleton loading={ isLoading } color={ color } fontWeight="bold">
        <span>
          { valueString }
        </span>
      </Skeleton>
    </Flex>
  );
};

export default React.memo(chakra(Utilization));
