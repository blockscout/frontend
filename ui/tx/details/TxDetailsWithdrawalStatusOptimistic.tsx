import React from 'react';

import type { OptimisticL2WithdrawalStatus } from 'types/api/optimisticL2';

import config from 'configs/app';
import { Button } from 'toolkit/chakra/button';
import { Link } from 'toolkit/chakra/link';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import VerificationSteps from 'ui/shared/verificationSteps/VerificationSteps';

interface Props {
  status: OptimisticL2WithdrawalStatus | undefined;
  l1TxHash: string | undefined;
}

const WITHDRAWAL_STATUS_STEPS: Array<OptimisticL2WithdrawalStatus> = [
  'Waiting for state root',
  'Ready to prove',
  'In challenge period',
  'Ready for relay',
  'Relayed',
];

const WITHDRAWAL_STATUS_ORDER_PROVEN: Array<OptimisticL2WithdrawalStatus> = [
  'Waiting for state root',
  'Ready to prove',
  'Proven',
  'Relayed',
];

const WITHDRAWAL_STATUS_ORDER_GAME: Array<OptimisticL2WithdrawalStatus> = [
  'Waiting for state root',
  'Ready to prove',
  'Waiting a game to resolve',
  'In challenge period',
  'Ready for relay',
  'Relayed',
];

const rollupFeature = config.features.rollup;

const TxDetailsWithdrawalStatusOptimistic = ({ status, l1TxHash }: Props) => {
  if (!status || !rollupFeature.isEnabled || rollupFeature.type !== 'optimistic') {
    return null;
  }

  const hasClaimButton = status === 'Ready for relay';

  const steps = (() => {
    switch (status) {
      case 'Ready for relay':
        return WITHDRAWAL_STATUS_STEPS.slice(0, -1);
      case 'Proven':
        return WITHDRAWAL_STATUS_ORDER_PROVEN;
      case 'Waiting a game to resolve':
        return WITHDRAWAL_STATUS_ORDER_GAME;
      case 'Relayed': {
        if (l1TxHash) {
          return WITHDRAWAL_STATUS_STEPS.map((status) => {
            return status === 'Relayed' ? {
              content: <TxEntityL1 hash={ l1TxHash } truncation="constant" text="Relayed" noIcon/>,
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

  const rightSlot = hasClaimButton ? (
    <Link
      href={ rollupFeature.L2WithdrawalUrl }
      asChild
      target="_blank"
    >
      <Button
        variant="outline"
        size="sm"
      >
        Claim funds
      </Button>
    </Link>
  ) : null;

  return (
    <VerificationSteps
      steps={ steps as unknown as Array<OptimisticL2WithdrawalStatus> }
      currentStep={ status }
      rightSlot={ rightSlot }
      my={ hasClaimButton ? '-6px' : 0 }
      lineHeight={ hasClaimButton ? '32px' : undefined }
    />
  );
};

export default React.memo(TxDetailsWithdrawalStatusOptimistic);
