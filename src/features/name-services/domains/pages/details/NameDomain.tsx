// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { route } from 'nextjs-routes';
import React from 'react';

import type { TabItemRegular } from 'src/toolkit/components/AdaptiveTabs/types';

import useApiQuery from 'src/api/hooks/useApiQuery';

import PageTitle from 'src/shell/page/title/PageTitle';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';

import TextAd from 'src/features/ads/text/components/TextAd';
import EnsEntity from 'src/features/name-services/domains/components/EnsEntity';
import NameDomainHistory from 'src/features/name-services/domains/pages/details/history/NameDomainHistory';
import NameDomainDetails from 'src/features/name-services/domains/pages/details/info/NameDomainDetails';
import { ENS_DOMAIN } from 'src/features/name-services/domains/stubs';

import config from 'src/config';
import throwOnResourceLoadError from 'src/shared/errors/throw-on-resource-load-error';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Link } from 'src/toolkit/chakra/link';
import { Tooltip } from 'src/toolkit/chakra/tooltip';
import RoutedTabs from 'src/toolkit/components/RoutedTabs/RoutedTabs';

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
        protocolDapp={{
          url: infoQuery.data?.protocol_dapp_url,
          logo: infoQuery.data?.protocol_dapp_logo,
        }}
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
              <SpriteIcon name="search" boxSize={ 5 } isLoading={ isLoading }/>
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
