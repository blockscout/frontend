// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import TokenHoldersActions from './TokenHoldersActions';
import TokenHoldersList from './TokenHoldersList';
import { useTokenHoldersQuery } from './useTokenHoldersQuery';

interface Props {
  token: schemas['Token'] | undefined;
  tokenId?: string;
  isLoading: boolean;
};

const TokenHolders = ({ token, tokenId, isLoading }: Props) => {
  const holdersQuery = useTokenHoldersQuery({ token, tokenId, enabled: !isLoading });

  const actionBar = (
    <ActionBar mt={ -6 }>
      <TokenHoldersActions token={ token } query={ holdersQuery }/>
    </ActionBar>
  );

  return <TokenHoldersList token={ token } query={ holdersQuery } actionBar={ actionBar }/>;
};

export default TokenHolders;
