// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text } from '@chakra-ui/react';
import React from 'react';

import type { TabItemRegular } from 'src/toolkit/components/AdaptiveTabs/types';

import PageTitle from 'src/shell/page/title/PageTitle';

import config from 'src/config';
import AlertWithExternalHtml from 'src/shared/alerts/AlertWithExternalHtml';

import RoutedTabs from 'src/toolkit/components/RoutedTabs/RoutedTabs';

import EthRpcApi from './EthRpcApi';
import GraphQL from './GraphQL';
import ProApi from './ProApi';
import RestApi from './RestApi';
import RpcApi from './RpcApi';

const feature = config.features.apiDocs;

const ApiDocs = () => {

  const tabs: Array<TabItemRegular> = [
    { id: 'pro_api', title: 'Pro API', component: <ProApi/> },
    { id: 'rest_api', title: 'REST API', component: <RestApi/> },
    { id: 'eth_rpc_api', title: 'ETH RPC API', component: <EthRpcApi/> },
    { id: 'rpc_api', title: 'RPC API endpoints', component: <RpcApi/> },
    { id: 'graphql_api', title: 'GraphQL API', component: <GraphQL/> },
  ].filter(({ id }) => feature.isEnabled && feature.tabs.includes(id));

  return (
    <>
      <PageTitle title="API documentation"/>
      { feature.isEnabled && feature.alertMessage ? <AlertWithExternalHtml html={ feature.alertMessage } status="info" showIcon mb={ 6 }/> : null }
      { tabs.length > 0 ? <RoutedTabs tabs={ tabs }/> : <Text>No API documentation available</Text> }
    </>
  );
};

export default React.memo(ApiDocs);
