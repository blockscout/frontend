import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { ArbitrumL2TxnBatchDACelestia } from 'types/api/arbitrumL2';

import CeleniumLink from 'ui/shared/batch/CeleniumLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

type Props = {
  data: ArbitrumL2TxnBatchDACelestia;
};

const ArbitrumL2TxnBatchDetailsCelestiaDA = ({ data }: Props) => {
  return (
    <>
      <DetailsInfoItem.Label
        hint="Height"
      >
        Height
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value wordBreak="break-all" whiteSpace="break-spaces">
        { data.height }
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="The hash of the transaction commitment"
      >
        Commitment
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value flexWrap="nowrap">
        <Flex overflow="hidden" minW="0">
          <HashStringShortenDynamic hash={ data.transaction_commitment }/>
        </Flex>
        <CopyToClipboard text={ data.transaction_commitment } mr={ 3 }/>
        <CeleniumLink commitment={ data.transaction_commitment } namespace="ca1de12a9905be97beaf" height={ data.height }/>
      </DetailsInfoItem.Value>
    </>
  );
};

export default ArbitrumL2TxnBatchDetailsCelestiaDA;
