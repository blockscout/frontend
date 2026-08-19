// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { chains } from 'src/features/connect-wallet/utils/chains';
import { useMultichainContext } from 'src/features/multichain/context';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';

import type { ButtonProps } from 'src/toolkit/chakra/button';
import { Button } from 'src/toolkit/chakra/button';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

const WithdrawalClaimButton = (props: ButtonProps) => {

  const multichainContext = useMultichainContext();
  const parentChain = getFeaturePayload((multichainContext?.chain.app_config ?? config).features.rollup)?.parentChain;
  const isParentChainConfigured = Boolean(parentChain?.id && chains.some(chain => chain.id === parentChain.id));

  return (
    <Tooltip
      content="The direct claim flow is not available because the parent chain is not configured. Please contact the project team to report this issue."
      disabled={ isParentChainConfigured }
    >
      <Button
        variant="outline"
        size="sm"
        disabled={ !isParentChainConfigured }
        { ...props }
      >
        Claim
      </Button>
    </Tooltip>
  );
};

export default React.memo(WithdrawalClaimButton);
