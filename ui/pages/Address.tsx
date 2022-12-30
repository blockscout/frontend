import { Flex, Tag } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import useApiQuery from 'lib/api/useApiQuery';
import notEmpty from 'lib/notEmpty';
import AddressBlocksValidated from 'ui/address/AddressBlocksValidated';
import AddressCoinBalance from 'ui/address/AddressCoinBalance';
import AddressDetails from 'ui/address/AddressDetails';
import AddressInternalTxs from 'ui/address/AddressInternalTxs';
import AddressTokenTransfers from 'ui/address/AddressTokenTransfers';
import AddressTxs from 'ui/address/AddressTxs';
import AddressLogs from 'ui/address/logs/AddressLogs';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';
import SkeletonTabs from 'ui/shared/skeletons/SkeletonTabs';

const AddressPageContent = () => {
  const router = useRouter();

  const addressQuery = useApiQuery('address', {
    pathParams: { id: router.query.id?.toString() },
    queryOptions: { enabled: Boolean(router.query.id) },
  });

  const tags = [
    ...(addressQuery.data?.private_tags || []),
    ...(addressQuery.data?.public_tags || []),
    ...(addressQuery.data?.watchlist_names || []),
  ].map((tag) => <Tag key={ tag.label }>{ tag.display_name }</Tag>);

  const isContract = addressQuery.data?.is_contract;

  const tabs: Array<RoutedTab> = React.useMemo(() => {
    return [
      { id: 'txs', title: 'Transactions', component: <AddressTxs/> },
      { id: 'token_transfers', title: 'Token transfers', component: <AddressTokenTransfers/> },
      { id: 'tokens', title: 'Tokens', component: null },
      { id: 'internal_txns', title: 'Internal txns', component: <AddressInternalTxs/> },
      { id: 'coin_balance_history', title: 'Coin balance history', component: <AddressCoinBalance/> },
      // temporary show this tab in all address
      // later api will return info about available tabs
      { id: 'blocks_validated', title: 'Blocks validated', component: <AddressBlocksValidated/> },
      isContract ? { id: 'logs', title: 'Logs', component: <AddressLogs/> } : undefined,
    ].filter(notEmpty);
  }, [ isContract ]);

  return (
    <Page>
      <Flex alignItems="center" columnGap={ 3 }>
        <PageTitle text={ `${ addressQuery.data?.is_contract ? 'Contract' : 'Address' } details` }/>
        { tags.length > 0 && (
          <Flex mb={ 6 } columnGap={ 2 }>
            { tags }
          </Flex>
        ) }
      </Flex>
      <AddressDetails addressQuery={ addressQuery }/>
      { addressQuery.isLoading ? <SkeletonTabs/> : <RoutedTabs tabs={ tabs } tabListProps={{ mt: 8 }}/> }
    </Page>
  );
};

export default AddressPageContent;
