import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { ArbitrumL2TxnBatchDACelestia } from 'types/api/arbitrumL2';

import config from 'configs/app';
import CeleniumLink from 'ui/shared/batch/CeleniumLink';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

const feature = config.features.rollup;

interface Props {
  data: ArbitrumL2TxnBatchDACelestia;
}

const ArbitrumL2TxnBatchDetailsCelestiaDA = ({ data }: Props) => {
  return (
    <>
      <DetailsInfoItem.Label
        hint="The block number in Celestia where the Data Availability blob was published"
      >
        Height
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value wordBreak="break-all" whiteSpace="break-spaces">
        { data.height }
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="The Data Availability blob’s unique cryptographic proof"
      >
        Commitment
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value flexWrap="nowrap">
        <Flex overflow="hidden" minW="0">
          <HashStringShortenDynamic hash={ data.transaction_commitment }/>
        </Flex>
        <CopyToClipboard text={ data.transaction_commitment } mr={ 3 }/>
        { feature.isEnabled && feature.DA.celestia.namespace && (
          <CeleniumLink
            commitment={ data.transaction_commitment }
            namespace={ feature.DA.celestia.namespace }
            height={ data.height }
          />
        ) }
      </DetailsInfoItem.Value>
    </>
  );
};

export default ArbitrumL2TxnBatchDetailsCelestiaDA;
