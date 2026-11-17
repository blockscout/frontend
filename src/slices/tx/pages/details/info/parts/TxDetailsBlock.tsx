// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import { SCROLL_L2_BLOCK_STATUSES } from 'src/features/rollup/scroll/types/api';

import BlockEntity from 'src/slices/block/components/entity/BlockEntity';

import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import VerificationSteps from 'src/shared/lifecycle/steps/VerificationSteps';
import TextSeparator from 'src/shared/texts/TextSeparator';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  data: Pick<schemas['TransactionResponse'], 'block_number' | 'confirmations' | 'scroll'>;
  isLoading: boolean;
}

const TxDetailsBlock = ({ data, isLoading }: Props) => {
  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Block number containing the transaction"
        isLoading={ isLoading }
      >
        Block
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue multiRow={ Boolean(data.scroll?.l2_block_status) }>
        { data.block_number === null ?
          <Text>Pending</Text> : (
            <BlockEntity
              isLoading={ isLoading }
              number={ data.block_number }
              noIcon
            />
          ) }
        { Boolean(data.confirmations) && (
          <>
            <TextSeparator/>
            <Skeleton loading={ isLoading } color="text.secondary">
              <span>{ data.confirmations } Block confirmations</span>
            </Skeleton>
          </>
        ) }
        { data.scroll?.l2_block_status && (
          <>
            <TextSeparator/>
            <VerificationSteps steps={ SCROLL_L2_BLOCK_STATUSES } currentStep={ data.scroll.l2_block_status } isLoading={ isLoading }/>
          </>
        ) }
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(TxDetailsBlock);
