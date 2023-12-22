import { Flex, Tooltip } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/Tabs/types';

import config from 'configs/app';
import iconSearch from 'icons/search.svg';
import useApiQuery from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ENS_DOMAIN } from 'stubs/ENS';
import NameDomainDetails from 'ui/nameDomain/NameDomainDetails';
import NameDomainHistory from 'ui/nameDomain/NameDomainHistory';
import TextAd from 'ui/shared/ad/TextAd';
import Icon from 'ui/shared/chakra/Icon';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import EnsEntity from 'ui/shared/entities/ens/EnsEntity';
import LinkInternal from 'ui/shared/LinkInternal';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TabsSkeleton from 'ui/shared/Tabs/TabsSkeleton';
import useTabIndexFromQuery from 'ui/shared/Tabs/useTabIndexFromQuery';

const NameDomain = () => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const domainName = getQueryParamString(router.query.name);

  const infoQuery = useApiQuery('domain_info', {
    pathParams: { name: domainName, chainId: config.chain.id },
    queryOptions: {
      placeholderData: ENS_DOMAIN,
    },
  });

  const tabs: Array<RoutedTab> = [
    { id: 'details', title: 'Details', component: <NameDomainDetails query={ infoQuery }/> },
    { id: 'history', title: 'History', component: <NameDomainHistory/> },
  ];

  const tabIndex = useTabIndexFromQuery(tabs);

  if (infoQuery.isError) {
    throw new Error(undefined, { cause: infoQuery.error });
  }

  const isLoading = infoQuery.isPlaceholderData;

  const titleSecondRow = (
    <Flex columnGap={ 3 } rowGap={ 3 } fontFamily="heading" fontSize="lg" fontWeight={ 500 } alignItems="center" w="100%">
      <EnsEntity
        name={ domainName }
        isLoading={ isLoading }
        noLink
        maxW="300px"
      />
      { infoQuery.data?.resolvedAddress && (
        <AddressEntity
          address={ infoQuery.data?.resolvedAddress }
          isLoading={ isLoading }
          truncation={ isMobile ? 'constant' : 'dynamic' }
          noLink
          flexShrink={ 0 }
        />
      ) }
      { /* TODO @tom2drum add correct href */ }
      <Tooltip label="Lookup for related domain names">
        <LinkInternal flexShrink={ 0 } display="inline-flex">
          <Icon as={ iconSearch } boxSize={ 5 } isLoading={ isLoading }/>
        </LinkInternal>
      </Tooltip>
    </Flex>
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle title="ENS Domain details" secondRow={ titleSecondRow }/>
      { infoQuery.isPlaceholderData ? (
        <>
          <TabsSkeleton tabs={ tabs } mt={ 6 }/>
          { tabs[tabIndex]?.component }
        </>
      ) : <RoutedTabs tabs={ tabs }/> }
    </>
  );
};

export default NameDomain;
