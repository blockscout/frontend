// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, chakra } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import config from 'src/config';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';

import TxDetailsWithdrawalStatusOptimistic from './TxDetailsWithdrawalStatusOptimistic';

const rollupFeature = config.features.rollup;
const isOptimistic = rollupFeature.isEnabled && rollupFeature.type === 'optimistic';

interface Props {
  data: Pick<schemas['TransactionResponse'], 'op_withdrawals' | 'hash' | 'from'>;
}

const TxDetailsOptimismWithdrawals = ({ data }: Props) => {
  if (!isOptimistic || !data.op_withdrawals?.length || config.slices.tx.hiddenFields?.L1_status) {
    return null;
  }

  return (
    <>
      <DetailedInfo.ItemLabel
        hint="Detailed status progress of the transaction"
      >
        Withdrawal status
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Flex flexDir="column" rowGap={ 2 }>
          { data.op_withdrawals.map((withdrawal) => (
            <Box key={ withdrawal.nonce }>
              <Box mb={ 2 } py={{ base: '5px', lg: 1 }}>
                <span>Nonce: </span>
                <chakra.span fontWeight={ 600 }>{ withdrawal.nonce }</chakra.span>
              </Box>
              <TxDetailsWithdrawalStatusOptimistic data={ withdrawal } txHash={ data.hash } from={ data.from }/>
            </Box>
          )) }
        </Flex>
      </DetailedInfo.ItemValue>
    </>
  );
};

export default React.memo(TxDetailsOptimismWithdrawals);
