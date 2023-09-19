import { Box, Flex, Skeleton, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import Hint from 'ui/shared/Hint';

type Props = {
  label: string;
  description?: string;
  value: string;
  isLoading?: boolean;
}

const NumberWidget = ({ label, value, isLoading, description }: Props) => {
  const bgColor = useColorModeValue('blue.50', 'blue.800');
  const skeletonBgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const hintColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Flex
      alignItems="flex-start"
      bg={ isLoading ? skeletonBgColor : bgColor }
      px={ 3 }
      py={{ base: 2, lg: 3 }}
      borderRadius={ 12 }
      justifyContent="space-between"
      columnGap={ 3 }
    >
      <Box
      >
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
          fontWeight={ 500 }
          fontSize="lg"
          w="fit-content"
        >
          { value }
        </Skeleton>

      </Box>
      <Skeleton isLoaded={ !isLoading } alignSelf="center" borderRadius="base">
        <Hint
          label={ description }
          boxSize={ 6 }
          color={ hintColor }
        />
      </Skeleton>
    </Flex>
  );
};

export default NumberWidget;
