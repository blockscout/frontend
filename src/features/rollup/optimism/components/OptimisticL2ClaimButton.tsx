// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { OptimisticL2WithdrawalClaimInfo } from 'src/features/rollup/optimism/types/api';

import { parentChain } from 'src/features/connect-wallet/utils/chains';
import OptimisticL2ClaimModal from 'src/features/rollup/optimism/components/OptimisticL2ClaimModal';

import config from 'src/config';

import { Button } from 'src/toolkit/chakra/button';
import { Link } from 'src/toolkit/chakra/link';
import { useDisclosure } from 'src/toolkit/hooks/useDisclosure';

const rollupFeature = config.features.rollup;

export const canClaimDirectlyGuard = (data: OptimisticL2WithdrawalClaimInfo) => {
  return (
    config.features.connectWallet.isEnabled &&
    Boolean(parentChain) &&
    data.portal_contract_address_hash !== null &&
    data.msg_sender_address_hash !== null &&
    data.msg_target_address_hash !== null &&
    data.msg_data !== null &&
    data.msg_gas_limit !== null &&
    data.msg_nonce_raw !== null &&
    data.msg_value !== null
  );
};

interface Props {
  data: OptimisticL2WithdrawalClaimInfo;
  from: schemas['Address'] | null;
  onSuccess: (txHash: string) => void;
  source: 'list' | 'tx';
}

const OptimisticL2ClaimButton = ({ data, from, onSuccess, source }: Props) => {

  const modal = useDisclosure();

  if (canClaimDirectlyGuard(data)) {
    return (
      <>
        { modal.open && (
          <OptimisticL2ClaimModal
            data={ data }
            onOpenChange={ modal.onOpenChange }
            proofSubmitterAddress={ from?.hash }
            onSuccess={ onSuccess }
          />
        ) }
        <Button variant="outline" size="sm" onClick={ modal.onOpen }>Claim</Button>
      </>
    );
  }

  if (!rollupFeature.isEnabled || !rollupFeature.L2WithdrawalUrl) {
    if (source === 'list') {
      return 'Ready for relay';
    }
    return null;
  }

  if (source === 'list') {
    return (
      <Link
        href={ rollupFeature.L2WithdrawalUrl }
        external
      >
        Ready for relay
      </Link>
    );
  }

  return (
    <Link
      href={ rollupFeature.L2WithdrawalUrl }
      external
      noIcon
    >
      <Button variant="outline" size="sm">Claim</Button>
    </Link>
  );
};

export default React.memo(OptimisticL2ClaimButton);
