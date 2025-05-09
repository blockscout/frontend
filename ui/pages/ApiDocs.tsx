import { Text } from '@chakra-ui/react';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import config from 'configs/app';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import EthRpcApi from 'ui/apiDocs/EthRpcApi';
import RestApi from 'ui/apiDocs/RestApi';
import RpcApi from 'ui/apiDocs/RpcApi';
import { SECTIONS } from 'ui/apiDocs/utils';
import PageTitle from 'ui/shared/Page/PageTitle';

const ApiDocs = () => {

  const tabs: Array<TabItemRegular> = [
    SECTIONS.length > 1 && { id: 'rest_api', title: 'REST API', component: <RestApi/>, count: SECTIONS.length },
    !config.UI.navigation.hiddenLinks?.eth_rpc_api && { id: 'eth_rpc_api', title: 'ETH RPC API', component: <EthRpcApi/> },
    !config.UI.navigation.hiddenLinks?.rpc_api && { id: 'rpc_api', title: 'RPC API Endpoints', component: <RpcApi/> },
  ].filter(Boolean);

  return (
    <>
      <PageTitle
        title={ config.meta.seo.enhancedDataEnabled ? `${ config.chain.name } API documentation` : 'API documentation' }
      />
      { tabs.length > 0 ? <RoutedTabs tabs={ tabs }/> : <Text>No API documentation available</Text> }
    </>
  );
};

export default React.memo(ApiDocs);
