// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import { SocketProvider } from 'src/api/socket/context';
import getSocketUrl from 'src/api/socket/get-socket-url';

import { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import TxsTabs, { getTabId } from 'src/slices/tx/pages/index/list/TxsTabs';
import TxsStats from 'src/slices/tx/pages/index/stats/TxsStats';

import { useMultichainContext } from 'src/features/multichain/context';

const PARENT_TAB = 'txs_local';
export const MULTICHAIN_TXS_LOCAL_TAB_IDS = [ getTabId('validated', PARENT_TAB), getTabId('pending', PARENT_TAB), getTabId('blob_txs', PARENT_TAB) ];
const TAB_LIST_PROPS = {
  marginBottom: 0,
  pt: 6,
  pb: { base: 9, lg: 3 },
};
const QUERY_PRESERVED_PARAMS = [ 'chain_id' ];

const MultichainTxsLocal = () => {
  const multichainContext = useMultichainContext();
  const chainConfig = multichainContext?.chain.app_config;

  return (
    <Box>
      <TxsStats mb={ 0 }/>
      <SocketProvider url={ getSocketUrl(chainConfig) }>
        <TxsTabs
          parentTab={ PARENT_TAB }
          variant="secondary"
          size="sm"
          preservedParams={ QUERY_PRESERVED_PARAMS }
          listProps={ TAB_LIST_PROPS }
          tabsHeight={ ACTION_BAR_HEIGHT_DESKTOP }
        />
      </SocketProvider>
    </Box>
  );
};

export default React.memo(MultichainTxsLocal);
