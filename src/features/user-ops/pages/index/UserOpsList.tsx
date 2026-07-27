// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import UserOpsListItem from './UserOpsListItem';

type Props = {
  items: Array<schemas['UserOperationInList']>;
  isLoading?: boolean;
  showTx: boolean;
  showSender: boolean;
  chainData?: ClusterChainConfig;
  resetKey?: string;
};

const UserOpsList = ({ items, isLoading, showTx, showSender, chainData, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <Box>
      { items.slice(0, renderedItemsNum).map((item, index) => (
        <UserOpsListItem
          key={ item.hash + (isLoading ? String(index) : '') }
          item={ item }
          isLoading={ isLoading }
          showTx={ showTx }
          showSender={ showSender }
          chainData={ chainData }
        />
      )) }
      <Box ref={ cutRef } h={ 0 }/>
    </Box>
  );
};

export default React.memo(UserOpsList);
