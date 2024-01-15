import { Button } from '@chakra-ui/react';
import React from 'react';

import type { L2WithdrawalStatus } from 'types/api/l2Withdrawals';
import { WITHDRAWAL_STATUSES } from 'types/api/l2Withdrawals';

import config from 'configs/app';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import VerificationSteps from 'ui/shared/verificationSteps/VerificationSteps';

interface Props {
  status: L2WithdrawalStatus | undefined;
  l1TxHash: string | undefined;
}

const TxDetailsWithdrawalStatus = ({ status, l1TxHash }: Props) => {
  if (!config.features.optimisticRollup.isEnabled) {
    return null;
  }

  if (!status || !WITHDRAWAL_STATUSES.includes(status)) {
    return null;
  }

  const hasClaimButton = status === 'Ready for relay';

  const steps = (() => {
    switch (status) {
      case 'Ready for relay':
        return WITHDRAWAL_STATUSES.slice(0, -1);
      case 'Relayed': {
        if (l1TxHash) {
          return WITHDRAWAL_STATUSES.map((status) => {
            return status === 'Relayed' ? {
              content: <TxEntityL1 hash={ l1TxHash } truncation="constant" text="Relayed" noIcon/>,
              label: status,
            } : status;
          });
        }

        return WITHDRAWAL_STATUSES;
      }

      default:
        return WITHDRAWAL_STATUSES;
    }
  })();

  const rightSlot = hasClaimButton ? (
    <Button
      variant="outline"
      size="sm"
      as="a"
      href="https://app.optimism.io/bridge/withdraw"
      target="_blank"
    >
            Claim funds
    </Button>
  ) : null;

  return (
    <DetailsInfoItem
      title="Withdrawal status"
      hint="Detailed status progress of the transaction"
    >
      <VerificationSteps
        steps={ steps as unknown as Array<L2WithdrawalStatus> }
        currentStep={ status }
        rightSlot={ rightSlot }
        my={ hasClaimButton ? '-6px' : 0 }
        lineHeight={ hasClaimButton ? 8 : undefined }
      />
    </DetailsInfoItem>
  );
};

export default React.memo(TxDetailsWithdrawalStatus);
