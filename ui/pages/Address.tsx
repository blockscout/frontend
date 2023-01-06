import { Flex, Skeleton, Tag } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import useApiQuery from 'lib/api/useApiQuery';
import notEmpty from 'lib/notEmpty';
import AddressBlocksValidated from 'ui/address/AddressBlocksValidated';
import AddressCoinBalance from 'ui/address/AddressCoinBalance';
import AddressContract from 'ui/address/AddressContract';
import AddressDetails from 'ui/address/AddressDetails';
import AddressInternalTxs from 'ui/address/AddressInternalTxs';
import AddressLogs from 'ui/address/AddressLogs';
import AddressTokenTransfers from 'ui/address/AddressTokenTransfers';
import AddressTxs from 'ui/address/AddressTxs';
import ContractCode from 'ui/address/contract/ContractCode';
import ContractRead from 'ui/address/contract/ContractRead';
import ContractWrite from 'ui/address/contract/ContractWrite';
import TextAd from 'ui/shared/ad/TextAd';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';
import SkeletonTabs from 'ui/shared/skeletons/SkeletonTabs';

const CONTRACT_TABS = [
  { id: 'contact_code', title: 'Code', component: <ContractCode/> },
  { id: 'contact_decompiled_code', title: 'Decompiled code', component: <div>Decompiled code</div> },
  { id: 'read_contract', title: 'Read contract', component: <ContractRead/> },
  { id: 'read_proxy', title: 'Read proxy', component: <div>Read proxy</div> },
  { id: 'write_contract', title: 'Write contract', component: <ContractWrite/> },
  { id: 'write_proxy', title: 'Write proxy', component: <div>Write proxy</div> },
];

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
      isContract ? {
        id: 'contract',
        title: 'Contract',
        component: <AddressContract tabs={ CONTRACT_TABS }/>,
        subTabs: CONTRACT_TABS,
      } : undefined,
    ].filter(notEmpty);
  }, [ isContract ]);

  const tagsNode = tags.length > 0 ? <Flex columnGap={ 2 }>{ tags }</Flex> : null;

  return (
    <Page>
      <TextAd mb={ 6 }/>
      { addressQuery.isLoading ? (
        <Skeleton h={ 10 } w="260px" mb={ 6 }/>
      ) : (
        <PageTitle
          text={ `${ addressQuery.data?.is_contract ? 'Contract' : 'Address' } details` }
          additionals={ tagsNode }
        />
      ) }
      <AddressDetails addressQuery={ addressQuery }/>
      { addressQuery.isLoading ? <SkeletonTabs/> : <RoutedTabs tabs={ tabs } tabListProps={{ mt: 8 }}/> }
    </Page>
  );
};

export default AddressPageContent;
