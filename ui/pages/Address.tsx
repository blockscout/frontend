import { Flex, Tag } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { Address } from 'types/api/address';
import { QueryKeys } from 'types/client/queries';
import type { RoutedTab } from 'ui/shared/RoutedTabs/types';

import useFetch from 'lib/hooks/useFetch';
import AddressDetails from 'ui/address/AddressDetails';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/RoutedTabs/RoutedTabs';

const AddressPageContent = () => {
  const router = useRouter();
  const fetch = useFetch();

  const addressQuery = useQuery<unknown, unknown, Address>(
    [ QueryKeys.address, router.query.id ],
    async() => await fetch(`/node-api/addresses/${ router.query.id }`),
    {
      enabled: Boolean(router.query.id),
    },
  );

  const tags = [
    ...(addressQuery.data?.private_tags || []),
    ...(addressQuery.data?.public_tags || []),
    ...(addressQuery.data?.watchlist_names || []),
  ].map((tag) => <Tag key={ tag.label }>{ tag.display_name }</Tag>);

  const tabs: Array<RoutedTab> = [
    { id: 'txs', title: 'Transactions', component: null },
    { id: 'token_transfers', title: 'Token transfers', component: null },
    { id: 'tokens', title: 'Tokens', component: null },
    { id: 'internal_txn', title: 'Internal txn', component: null },
    { id: 'coin_balance_history', title: 'Coin balance history', component: null },
  ];

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
      <RoutedTabs tabs={ tabs } tabListProps={{ mt: 8 }}/>
    </Page>
  );
};

export default AddressPageContent;
