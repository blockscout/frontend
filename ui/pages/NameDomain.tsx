// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import { route } from 'nextjs-routes';

import useApiQuery from 'client/api/hooks/useApiQuery';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';

import throwOnResourceLoadError from 'client/shared/errors/throw-on-resource-load-error';
import getQueryParamString from 'client/shared/router/get-query-param-string';

import config from 'configs/app';
import { ENS_DOMAIN } from 'stubs/ENS';
import { Link } from 'toolkit/chakra/link';
import { Tooltip } from 'toolkit/chakra/tooltip';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import NameDomainDetails from 'ui/nameDomain/NameDomainDetails';
import NameDomainHistory from 'ui/nameDomain/NameDomainHistory';
import TextAd from 'ui/shared/ad/TextAd';
import EnsEntity from 'ui/shared/entities/ens/EnsEntity';
import IconSvg from 'ui/shared/IconSvg';
import PageTitle from 'ui/shared/Page/PageTitle';

const feature = config.features.nameServices;
const availableProtocols = feature.isEnabled && feature.ens.isEnabled ? feature.ens.protocols : [];

const NameDomain = () => {
  const router = useRouter();
  const domainName = getQueryParamString(router.query.name);
  const protocolId = getQueryParamString(router.query.protocol_id) || availableProtocols[0];

  const infoQuery = useApiQuery('bens:domain_info', {
    pathParams: { name: domainName },
    queryParams: {
      protocol_id: protocolId,
    },
    queryOptions: {
      placeholderData: ENS_DOMAIN,
    },
  });

  const tabs: Array<TabItemRegular> = [
    { id: 'details', title: 'Details', component: <NameDomainDetails query={ infoQuery }/> },
    { id: 'history', title: 'History', component: <NameDomainHistory domain={ infoQuery.data }/> },
  ];

  throwOnResourceLoadError(infoQuery);

  const isLoading = infoQuery.isPlaceholderData;

  const titleSecondRow = (
    <Flex
      columnGap={ 3 }
      rowGap={ 3 }
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
        variant="subheading"
      />
      { infoQuery.data?.resolved_address && (
        <Flex alignItems="center" maxW="100%" columnGap={ 2 }>
          <AddressEntity
            address={ infoQuery.data?.resolved_address }
            isLoading={ isLoading }
            variant="subheading"
          />
          <Tooltip content="Lookup for related domain names">
            <Link
              flexShrink={ 0 }
              display="inline-flex"
              href={ route({
                pathname: '/name-services',
                query: { tab: 'domains', owned_by: 'true', resolved_to: 'true', address: infoQuery.data?.resolved_address?.hash },
              }) }
            >
              <IconSvg name="search" boxSize={ 5 } isLoading={ isLoading }/>
            </Link>
          </Tooltip>
        </Flex>
      ) }
    </Flex>
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle title="Name details" secondRow={ titleSecondRow }/>
      <RoutedTabs tabs={ tabs } isLoading={ infoQuery.isPlaceholderData }/>
    </>
  );
};

export default NameDomain;
