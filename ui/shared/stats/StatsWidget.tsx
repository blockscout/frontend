import { Box, Flex, Text, Skeleton, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import Hint from 'ui/shared/Hint';

type Props = {
  label: string;
  value: string;
  hint?: string;
  isLoading?: boolean;
  diff?: string | number;
  diffFormatted?: string;
  diffPeriod?: '24h';
}

const StatsWidget = ({ label, value, isLoading, hint, diff, diffPeriod = '24h', diffFormatted }: Props) => {
  const bgColor = useColorModeValue('blue.50', 'blue.800');
  const skeletonBgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const hintColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Flex
      alignItems="flex-start"
      bgColor={ isLoading ? skeletonBgColor : bgColor }
      px={ 3 }
      py={{ base: 2, lg: 3 }}
      borderRadius="md"
      justifyContent="space-between"
      columnGap={ 3 }
    >
      <Box>
        <Skeleton
          isLoaded={ !isLoading }
          color="text_secondary"
          fontSize="xs"
          w="fit-content"
        >
          <span>{ label }</span>
        </Skeleton>
        <Skeleton
          isLoaded={ !isLoading }
          w="fit-content"
          display="flex"
          alignItems="baseline"
          mt={ 1 }
        >
          <Text fontWeight={ 500 } fontSize="lg" lineHeight={ 6 }>{ value }</Text>
          { diff && Number(diff) > 0 && (
            <>
              <Text fontWeight={ 500 } ml={ 2 } mr={ 1 } fontSize="lg" lineHeight={ 6 } color="green.500">
                +{ diffFormatted || Number(diff).toLocaleString() }
              </Text>
              <Text variant="secondary" fontSize="sm">({ diffPeriod })</Text>
            </>
          ) }
        </Skeleton>
      </Box>
      { hint && (
        <Skeleton isLoaded={ !isLoading } alignSelf="center" borderRadius="base">
          <Hint label={ hint } boxSize={ 6 } color={ hintColor }/>
        </Skeleton>
      ) }
    </Flex>
  );
};

export default StatsWidget;
