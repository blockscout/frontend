// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import getSocketUrl from 'client/api/get-socket-url';
import { SocketProvider } from 'client/api/socket/context';

import TxsTabs, { getTabId } from 'client/slices/tx/pages/index/list/TxsTabs';
import TxsStats from 'client/slices/tx/pages/index/stats/TxsStats';

import { useMultichainContext } from 'lib/contexts/multichain';
import { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';

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
