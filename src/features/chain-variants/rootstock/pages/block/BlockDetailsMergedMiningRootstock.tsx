// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import RawDataSnippet from 'src/shared/data/RawDataSnippet';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import CopyToClipboard from 'src/shared/texts/CopyToClipboard';

import { Truncate } from 'src/toolkit/components/truncation/Truncate';

interface Props {
  data: Pick<
    schemas['BlockResponse'],
    'bitcoin_merged_mining_header' | 'bitcoin_merged_mining_coinbase_transaction' | 'bitcoin_merged_mining_merkle_proof' | 'hash_for_merged_mining'
  >;
  isLoading: boolean;
}

const BlockDetailsMergedMiningRootstock = ({ data, isLoading }: Props) => {
  return (
    <>
      { data.bitcoin_merged_mining_header && (
        <>
          <DetailedInfo.ItemLabel
            hint="Merged-mining field: Bitcoin header"
          >
            Bitcoin merged mining header
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue
            flexWrap="nowrap"
            alignSelf="flex-start"
          >
            <Box whiteSpace="nowrap" overflow="hidden">
              <Truncate value={ data.bitcoin_merged_mining_header }/>
            </Box>
            <CopyToClipboard text={ data.bitcoin_merged_mining_header }/>
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.bitcoin_merged_mining_coinbase_transaction && (
        <>
          <DetailedInfo.ItemLabel
            hint="Merged-mining field: Coinbase transaction"
          >
            Bitcoin merged mining coinbase transaction
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <RawDataSnippet
              data={ data.bitcoin_merged_mining_coinbase_transaction }
              isLoading={ isLoading }
              showCopy={ false }
              textareaMaxHeight="100px"
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.bitcoin_merged_mining_merkle_proof && (
        <>
          <DetailedInfo.ItemLabel
            hint="Merged-mining field: Merkle proof"
          >
            Bitcoin merged mining Merkle proof
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <RawDataSnippet
              data={ data.bitcoin_merged_mining_merkle_proof }
              isLoading={ isLoading }
              showCopy={ false }
              textareaMaxHeight="100px"
            />
          </DetailedInfo.ItemValue>
        </>
      ) }

      { data.hash_for_merged_mining && (
        <>
          <DetailedInfo.ItemLabel
            hint="Merged-mining field: Rootstock block header hash"
          >
            Hash for merged mining
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue
            flexWrap="nowrap"
            alignSelf="flex-start"
          >
            <Box whiteSpace="nowrap" overflow="hidden">
              <Truncate value={ data.hash_for_merged_mining }/>
            </Box>
            <CopyToClipboard text={ data.hash_for_merged_mining }/>
          </DetailedInfo.ItemValue>
        </>
      ) }
    </>
  );
};

export default React.memo(BlockDetailsMergedMiningRootstock);
