// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { operations, schemas } from '@blockscout/api-types';

import { getResourceKey } from 'src/api/hooks/useApiQuery';

import OptimisticL2ClaimButton from 'src/features/rollup/optimism/components/OptimisticL2ClaimButton';

import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props {
  data: schemas['OptimismWithdrawal'];
  isLoading?: boolean;
}

const OptimisticL2WithdrawalsItemStatus = ({ data, isLoading }: Props) => {

  const queryClient = useQueryClient();

  const handleClaimSuccess = React.useCallback((l1TxHash: string) => {
    queryClient.setQueriesData({
      queryKey: getResourceKey('core:optimistic_l2_withdrawals'),
      exact: false,
      type: 'active',
    },
    (prevData: operations['OptimismController.withdrawals']['json'] | undefined) => {
      if (!prevData) {
        return;
      }

      const newItems = prevData.items.map((withdrawal) => {
        if (`${ withdrawal.msg_nonce_version }-${ withdrawal.msg_nonce }` === `${ data.msg_nonce_version }-${ data.msg_nonce }`) {
          return {
            ...withdrawal,
            l1_transaction_hash: l1TxHash,
            status: 'Relayed' as const,
          };
        }
        return withdrawal;
      });

      return {
        ...prevData,
        items: newItems,
      };
    });
  }, [ data.msg_nonce, data.msg_nonce_version, queryClient ]);

  if (data.status !== 'Ready for relay') {
    return <Skeleton loading={ isLoading } display="inline-block">{ data.status }</Skeleton>;
  }

  return <OptimisticL2ClaimButton data={ data } from={ data.from } onSuccess={ handleClaimSuccess } source="list"/>;
};

export default React.memo(OptimisticL2WithdrawalsItemStatus);
