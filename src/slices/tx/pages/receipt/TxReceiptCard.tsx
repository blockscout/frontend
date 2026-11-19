// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import NetworkLogoImage from 'src/slices/chain/logo/NetworkLogoImage';
import { TX } from 'src/slices/tx/stubs/tx';

import TxReceiptSummary from './summary/TxReceiptSummary';
import { useTxReceiptInterpretation } from './summary/useTxReceiptInterpretation';
import TxReceiptActions from './TxReceiptActions';
import TxReceiptDetails from './TxReceiptDetails';
import TxReceiptStatus from './TxReceiptStatus';
import { useTxReceiptChainConfig } from './useTxReceiptChainConfig';

// the skeletons are wider than most settled cards, so a loading card keeps its narrowest width instead of following them
const NARROW_CARD_WIDTH = '360px';

interface Props {
  readonly hash: string;
  readonly data: schemas['TransactionResponse'];
  readonly isLoading: boolean;
}

const TxReceiptCard = ({ hash, data, isLoading: isTxLoading }: Props) => {
  const interpretation = useTxReceiptInterpretation({ hash, status: data.status, isTxLoading });
  const chainConfig = useTxReceiptChainConfig();

  // the first load shows one unchanging placeholder until the headline is in; a later headline fetch,
  // once a pending transaction settles, keeps the card as it is
  const [ hasLoaded, setHasLoaded ] = React.useState(false);
  const isLoading = !hasLoaded && (isTxLoading || interpretation.isLoading);
  if (!isLoading && !hasLoaded) {
    setHasLoaded(true);
  }
  const shownData = isLoading ? TX : data;

  return (
    <Flex
      as="article"
      flexDir="column"
      gap={ 8 }
      w={{ base: '100%', lg: isLoading ? NARROW_CARD_WIDTH : 'fit-content' }}
      minW={{ lg: NARROW_CARD_WIDTH }}
      maxW="500px"
      p={{ base: 6, lg: 8 }}
      bgColor="bg.primary"
      borderRadius="md"
      boxShadow="size.xl"
    >
      <Flex alignItems="center" justifyContent="space-between" columnGap={ 3 }>
        <NetworkLogoImage chainConfig={ chainConfig }/>
        <TxReceiptStatus status={ shownData.status } isLoading={ isLoading }/>
      </Flex>
      <Flex flexDir="column" gap={ 6 }>
        <TxReceiptSummary data={ shownData } interpretations={ interpretation.summaries } isLoading={ isLoading }/>
        <TxReceiptDetails data={ shownData } isLoading={ isLoading }/>
      </Flex>
      <TxReceiptActions hash={ hash }/>
    </Flex>
  );
};

export default React.memo(TxReceiptCard);
