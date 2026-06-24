// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { getResourceKey } from 'src/api/hooks/useApiQuery';

import TxEntityL1 from 'src/features/rollup/common/components/TxEntityL1';
import OptimisticL2ClaimButton, { canClaimDirectlyGuard } from 'src/features/rollup/optimism/components/OptimisticL2ClaimButton';

import config from 'src/config';
import VerificationSteps from 'src/shared/lifecycle/steps/VerificationSteps';

interface Props {
  data: schemas['OptimismTransactionWithdrawal'];
  from: schemas['Address'];
  txHash: string;
}

const WITHDRAWAL_STATUS_STEPS: Array<schemas['OptimismWithdrawal']['status']> = [
  'Waiting for state root',
  'Ready to prove',
  'In challenge period',
  'Ready for relay',
  'Relayed',
];

const WITHDRAWAL_STATUS_ORDER_PROVEN: Array<schemas['OptimismWithdrawal']['status']> = [
  'Waiting for state root',
  'Ready to prove',
  'Proven',
  'Relayed',
];

const WITHDRAWAL_STATUS_ORDER_GAME: Array<schemas['OptimismWithdrawal']['status']> = [
  'Waiting for state root',
  'Ready to prove',
  'Waiting a game to resolve',
  'In challenge period',
  'Ready for relay',
  'Relayed',
];

const rollupFeature = config.features.rollup;

const TxDetailsWithdrawalStatusOptimistic = ({ data, from, txHash }: Props) => {
  const queryClient = useQueryClient();

  const handleClaimSuccess = React.useCallback((l1TxHash: string) => {
    queryClient.setQueryData(
      getResourceKey('core:tx', { pathParams: { hash: txHash } }),
      (prevData: schemas['Transaction'] | undefined) => {
        if (!prevData) {
          return;
        }

        const newWithdrawals = prevData.op_withdrawals?.map((withdrawal) => {
          if (withdrawal.nonce === data.nonce) {
            return {
              ...withdrawal,
              l1_transaction_hash: l1TxHash,
              status: 'Relayed',
            };
          }
          return withdrawal;
        });

        return {
          ...prevData,
          op_withdrawals: newWithdrawals,
        };
      });
  }, [ data.nonce, queryClient, txHash ]);

  if (!data.status || !rollupFeature.isEnabled || rollupFeature.type !== 'optimistic') {
    return null;
  }

  const canClaimDirectly = canClaimDirectlyGuard(data);
  const hasRightSlot = data.status === 'Ready for relay' && (rollupFeature.L2WithdrawalUrl || canClaimDirectly);

  const rightSlot = hasRightSlot ?
    <OptimisticL2ClaimButton data={ data } from={ from } onSuccess={ handleClaimSuccess } source="tx"/> :
    null;

  const steps = (() => {
    switch (data.status) {
      case 'Ready for relay':
        return hasRightSlot ? WITHDRAWAL_STATUS_STEPS.slice(0, -1) : WITHDRAWAL_STATUS_STEPS;
      case 'Proven':
        return WITHDRAWAL_STATUS_ORDER_PROVEN;
      case 'Waiting a game to resolve':
        return WITHDRAWAL_STATUS_ORDER_GAME;
      case 'Relayed': {
        if (data.l1_transaction_hash) {
          return WITHDRAWAL_STATUS_STEPS.map((status) => {
            return status === 'Relayed' && data.l1_transaction_hash ? {
              content: <TxEntityL1 hash={ data.l1_transaction_hash } truncation="constant" text="Relayed" noIcon noCopy/>,
              label: status,
            } : status;
          });
        }

        return WITHDRAWAL_STATUS_STEPS;
      }

      default:
        return WITHDRAWAL_STATUS_STEPS;
    }
  })();

  return (
    <VerificationSteps
      steps={ steps }
      currentStep={ data.status }
      rightSlot={ rightSlot }
    />
  );
};

export default React.memo(TxDetailsWithdrawalStatusOptimistic);
