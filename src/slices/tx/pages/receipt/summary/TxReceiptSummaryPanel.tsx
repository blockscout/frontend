// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, Separator } from '@chakra-ui/react';
import React from 'react';

import { Heading } from 'src/toolkit/chakra/heading';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  readonly action: string | null;
  readonly children: React.ReactNode;
  readonly parties: React.ReactNode;
  readonly isLoading: boolean;
}

const TxReceiptSummaryPanel = ({ action, children, parties, isLoading }: Props) => {
  return (
    <Flex
      as="section"
      aria-label="Transaction summary"
      flexDir="column"
      borderRadius="md"
      bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.100' }}
    >
      <Flex flexDir="column" alignItems="center" rowGap={ 2 } p={ 4 } textAlign="center">
        { action && (
          <Skeleton loading={ isLoading }>
            <Heading as="h3" textStyle="heading.md" color="text.secondary">{ action }</Heading>
          </Skeleton>
        ) }
        <Box textStyle="heading.lg" color="text.primary" maxW="100%">
          { children }
        </Box>
      </Flex>
      <Separator borderColor="bg.primary"/>
      <Box p={ 4 }>
        { parties }
      </Box>
    </Flex>
  );
};

export default React.memo(TxReceiptSummaryPanel);
