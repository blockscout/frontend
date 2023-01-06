import { Flex, Skeleton, Tag, Box } from '@chakra-ui/react';
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
import TextAd from 'ui/shared/ad/TextAd';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';
import SkeletonTabs from 'ui/shared/skeletons/SkeletonTabs';

const AddressPageContent = () => {
  const router = useRouter();

  const tabsScrollRef = React.useRef<HTMLDivElement>(null);

  const addressQuery = useApiQuery('address', {
    pathParams: { id: router.query.id?.toString() },
    queryOptions: { enabled: Boolean(router.query.id) },
  });

  const tags = [
    ...(addressQuery.data?.private_tags || []),
    ...(addressQuery.data?.public_tags || []),
    ...(addressQuery.data?.watchlist_names || []),
  ].map((tag) => <Tag key={ tag.label }>{ tag.display_name }</Tag>);

  const contractTabs = React.useMemo(() => {
    return [
      { id: 'contact_code', title: 'Code', component: <ContractCode/> },
      addressQuery.data?.has_decompiled_code ?
        { id: 'contact_decompiled_code', title: 'Decompiled code', component: <div>Decompiled code</div> } :
        undefined,
      addressQuery.data?.has_methods_read ?
        { id: 'read_contract', title: 'Read contract', component: <div>Read contract</div> } :
        undefined,
      addressQuery.data?.has_methods_read_proxy ?
        { id: 'read_proxy', title: 'Read proxy', component: <div>Read proxy</div> } :
        undefined,
      addressQuery.data?.has_custom_methods_read ?
        { id: 'read_custom_methods', title: 'Read custom methods', component: <div>Read custom methods</div> } :
        undefined,
      addressQuery.data?.has_methods_write ?
        { id: 'write_contract', title: 'Write contract', component: <div>Write contract</div> } :
        undefined,
      addressQuery.data?.has_methods_write_proxy ?
        { id: 'write_proxy', title: 'Write proxy', component: <div>Write proxy</div> } :
        undefined,
      addressQuery.data?.has_custom_methods_write ?
        { id: 'write_custom_methods', title: 'Write custom methods', component: <div>Write custom methods</div> } :
        undefined,
    ].filter(notEmpty);
  }, [ addressQuery.data ]);

  const tabs: Array<RoutedTab> = React.useMemo(() => {
    return [
      { id: 'txs', title: 'Transactions', component: <AddressTxs scrollRef={ tabsScrollRef }/> },
      addressQuery.data?.has_token_transfers ?
        { id: 'token_transfers', title: 'Token transfers', component: <AddressTokenTransfers scrollRef={ tabsScrollRef }/> } :
        undefined,
      addressQuery.data?.has_tokens ? { id: 'tokens', title: 'Tokens', component: null } : undefined,
      { id: 'internal_txns', title: 'Internal txns', component: <AddressInternalTxs scrollRef={ tabsScrollRef }/> },
      { id: 'coin_balance_history', title: 'Coin balance history', component: <AddressCoinBalance/> },
      addressQuery.data?.has_validated_blocks ?
        { id: 'blocks_validated', title: 'Blocks validated', component: <AddressBlocksValidated scrollRef={ tabsScrollRef }/> } :
        undefined,
      addressQuery.data?.has_logs ? { id: 'logs', title: 'Logs', component: <AddressLogs scrollRef={ tabsScrollRef }/> } : undefined,
      addressQuery.data?.is_contract ? {
        id: 'contract',
        title: 'Contract',
        component: <AddressContract tabs={ contractTabs }/>,
        subTabs: contractTabs,
      } : undefined,
    ].filter(notEmpty);
  }, [ addressQuery.data, contractTabs ]);

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
      { /* should stay before tabs to scroll up whith pagination */ }
      <Box ref={ tabsScrollRef }></Box>
      { addressQuery.isLoading ? <SkeletonTabs/> : <RoutedTabs tabs={ tabs } tabListProps={{ mt: 8 }}/> }
    </Page>
  );
};

export default AddressPageContent;
