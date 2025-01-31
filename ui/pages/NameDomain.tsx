import { Flex, Tooltip } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/Tabs/types';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ENS_DOMAIN } from 'stubs/ENS';
import NameDomainDetails from 'ui/nameDomain/NameDomainDetails';
import NameDomainHistory from 'ui/nameDomain/NameDomainHistory';
import TextAd from 'ui/shared/ad/TextAd';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import EnsEntity from 'ui/shared/entities/ens/EnsEntity';
import IconSvg from 'ui/shared/IconSvg';
import LinkInternal from 'ui/shared/links/LinkInternal';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TabsSkeleton from 'ui/shared/Tabs/TabsSkeleton';
import useTabIndexFromQuery from 'ui/shared/Tabs/useTabIndexFromQuery';

const NameDomain = () => {
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
    { id: 'history', title: 'History', component: <NameDomainHistory domain={ infoQuery.data }/> },
  ];

  const tabIndex = useTabIndexFromQuery(tabs);

  throwOnResourceLoadError(infoQuery);

  const isLoading = infoQuery.isPlaceholderData;

  const titleSecondRow = (
    <Flex
      columnGap={ 3 }
      rowGap={ 3 }
      fontFamily="heading"
      fontSize="lg"
      fontWeight={ 500 }
      alignItems="center"
      w="100%"
      flexWrap={{ base: 'wrap', lg: 'nowrap' }}
    >
      <EnsEntity
        domain={ domainName }
        protocol={ infoQuery.data?.protocol }
        isLoading={ isLoading }
        noLink
        maxW={{ lg: infoQuery.data?.resolved_address ? '300px' : 'max-content' }}
      />
      { infoQuery.data?.resolved_address && (
        <Flex alignItems="center" maxW="100%" columnGap={ 3 }>
          <AddressEntity
            address={ infoQuery.data?.resolved_address }
            isLoading={ isLoading }
          />
          <Tooltip label="Lookup for related domain names">
            <LinkInternal
              flexShrink={ 0 }
              display="inline-flex"
              href={ route({ pathname: '/name-domains', query: { owned_by: 'true', resolved_to: 'true', address: infoQuery.data?.resolved_address?.hash } }) }
            >
              <IconSvg name="search" boxSize={ 5 } isLoading={ isLoading }/>
            </LinkInternal>
          </Tooltip>
        </Flex>
      ) }
    </Flex>
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle title="Name details" secondRow={ titleSecondRow }/>
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
