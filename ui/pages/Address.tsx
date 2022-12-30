import { Flex, Tag } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import useApiQuery from 'lib/api/useApiQuery';
import AddressBlocksValidated from 'ui/address/AddressBlocksValidated';
import AddressCoinBalance from 'ui/address/AddressCoinBalance';
import AddressDetails from 'ui/address/AddressDetails';
import AddressInternalTxs from 'ui/address/AddressInternalTxs';
import AddressTokenTransfers from 'ui/address/AddressTokenTransfers';
import AddressTxs from 'ui/address/AddressTxs';
import TextAd from 'ui/shared/ad/TextAd';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';

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

  const tabs: Array<RoutedTab> = [
    { id: 'txs', title: 'Transactions', component: <AddressTxs/> },
    { id: 'token_transfers', title: 'Token transfers', component: <AddressTokenTransfers/> },
    { id: 'tokens', title: 'Tokens', component: null },
    { id: 'internal_txns', title: 'Internal txns', component: <AddressInternalTxs/> },
    { id: 'coin_balance_history', title: 'Coin balance history', component: <AddressCoinBalance addressQuery={ addressQuery }/> },
    // temporary show this tab in all address
    // later api will return info about available tabs
    { id: 'blocks_validated', title: 'Blocks validated', component: <AddressBlocksValidated addressQuery={ addressQuery }/> },
  ];

  const tagsNode = tags.length > 0 ? <Flex columnGap={ 2 }>{ tags }</Flex> : null;

  return (
    <Page>
      <TextAd mb={ 6 }/>
      <PageTitle
        text={ `${ addressQuery.data?.is_contract ? 'Contract' : 'Address' } details` }
        additionals={ tagsNode }
      />
      <AddressDetails addressQuery={ addressQuery }/>
      <RoutedTabs tabs={ tabs } tabListProps={{ mt: 8 }}/>
    </Page>
  );
};

export default AddressPageContent;
