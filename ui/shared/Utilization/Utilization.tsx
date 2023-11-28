import { Box, Flex, Skeleton, chakra, useColorModeValue } from '@chakra-ui/react';
import clamp from 'lodash/clamp';
import React from 'react';

interface Props {
  className?: string;
  value: number;
  colorScheme?: 'green' | 'gray'|'accent';
  isLoading?: boolean;
}

const WIDTH = 50;

const Utilization = ({ className, value, colorScheme = 'green', isLoading }: Props) => {
  const valueString = (clamp(value * 100 || 0, 0, 100)).toLocaleString(undefined, { maximumFractionDigits: 2 }) + '%';
  let color;

  switch (colorScheme) {
    case 'accent':
      color = 'accent';
      break;
    case 'gray':
      color = 'text_secondary';
      break;
    case 'green':
      color = 'green.500';
      break;
  }

  return (
    <Flex className={ className } alignItems="center" columnGap="10px">
      <Skeleton isLoaded={ !isLoading } w={ `${ WIDTH }px` } h="4px" borderRadius="full" overflow="hidden">
        <Box bg={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') } h="100%">
          <Box bg={ color } w={ valueString } h="100%"/>
        </Box>
      </Skeleton>
      <Skeleton isLoaded={ !isLoading } color={ color } fontWeight="bold">
        <span>
          { valueString }
        </span>
      </Skeleton>
    </Flex>
  );
};

export default React.memo(chakra(Utilization));
