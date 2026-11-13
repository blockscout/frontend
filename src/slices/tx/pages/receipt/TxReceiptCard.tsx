// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import NetworkLogoImage from 'src/slices/chain/logo/NetworkLogoImage';

import config from 'src/config';

import TxReceiptActions from './TxReceiptActions';
import TxReceiptDetails from './TxReceiptDetails';
import TxReceiptStatus from './TxReceiptStatus';

interface Props {
  readonly hash: string;
  readonly data: schemas['TransactionResponse'];
  readonly isLoading: boolean;
}

const TxReceiptCard = ({ hash, data, isLoading }: Props) => {
  return (
    <Flex
      as="article"
      flexDir="column"
      gap={ 8 }
      w={{ base: '100%', lg: 'fit-content' }}
      minW={{ lg: '360px' }}
      maxW="456px"
      p={{ base: 6, lg: 8 }}
      bgColor="bg.primary"
      borderRadius="md"
      boxShadow="size.xl"
    >
      <Flex alignItems="center" justifyContent="space-between" columnGap={ 3 }>
        <NetworkLogoImage chainConfig={ config.chain }/>
        <TxReceiptStatus status={ data.status } isLoading={ isLoading }/>
      </Flex>
      <Flex flexDir="column" gap={ 6 }>
        <Box minH="149px" borderRadius="md" bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.100' }}/>
        <TxReceiptDetails data={ data } isLoading={ isLoading }/>
      </Flex>
      <TxReceiptActions hash={ hash }/>
    </Flex>
  );
};

export default React.memo(TxReceiptCard);
