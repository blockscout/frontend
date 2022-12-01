import { Flex, Tag } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { Address } from 'types/api/address';
import { QueryKeys } from 'types/client/queries';

import useFetch from 'lib/hooks/useFetch';
import AddressDetails from 'ui/address/AddressDetails';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

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
    </Page>
  );
};

export default AddressPageContent;
