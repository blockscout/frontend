import { Heading, Skeleton, useColorModeValue } from '@chakra-ui/react';
import { useQueryClient, type UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { Address } from 'types/api/address';
import type { TokenInstance } from 'types/api/token';

import nftIcon from 'icons/nft_shield.svg';
import { getResourceKey } from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import * as regexp from 'lib/regexp';
import TextAd from 'ui/shared/ad/TextAd';
import AddressActionButtons from 'ui/shared/AddressActionButtons';
import Icon from 'ui/shared/chakra/Icon';
import Tag from 'ui/shared/chakra/Tag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import LinkExternal from 'ui/shared/LinkExternal';
import * as PageTitle from 'ui/shared/PageTitle/PageTitle';
import TruncatedValue from 'ui/shared/TruncatedValue';

interface Props {
  tokenInstanceQuery: UseQueryResult<TokenInstance>;
  hash: string | undefined;
}

const TokenInstancePageTitle = ({ tokenInstanceQuery, hash }: Props) => {
  const appProps = useAppContext();

  const isLoading = tokenInstanceQuery.isPlaceholderData;

  const queryClient = useQueryClient();
  const addressData = queryClient.getQueryData<Address>(getResourceKey('address', { pathParams: { hash: hash } }));

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes(`/token/${ hash }`) && !appProps.referrer.includes('instance');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to token page',
      url: appProps.referrer,
    };
  }, [ appProps.referrer, hash ]);

  const nftShieldIcon = isLoading ?
    <Skeleton boxSize="30px" display="inline-block" borderRadius="base" verticalAlign="text-bottom" flexShrink={ 0 }/> :
    <Icon as={ nftIcon } boxSize="30px" flexShrink={ 0 }/>;

  const tokenTag = <Tag isLoading={ isLoading }>{ tokenInstanceQuery.data?.token.type }</Tag>;

  const address = {
    hash: hash || '',
    is_contract: true,
    is_verified: addressData?.is_verified,
    implementation_name: null,
    watchlist_names: [],
    watchlist_address_id: null,
  };

  const websiteLinkBg = useColorModeValue('gray.100', 'gray.700');

  const appLink = (() => {
    if (!tokenInstanceQuery.data?.external_app_url) {
      return null;
    }

    if (isLoading) {
      return <Skeleton w="110px" h="32px" ml="auto"/>;
    }

    const styles = {
      px: '10px',
      py: '6px',
      bgColor: websiteLinkBg,
      borderRadius: 'base',
      ml: 'auto',
      fontSize: 'sm',
      lineHeight: '20px',
    };

    try {
      const url = regexp.URL_PREFIX.test(tokenInstanceQuery.data.external_app_url) ?
        new URL(tokenInstanceQuery.data.external_app_url) :
        new URL('https://' + tokenInstanceQuery.data.external_app_url);

      return (
        <LinkExternal
          isLoading={ isLoading }
          href={ url.toString() }
          { ...styles }
        >
          { url.hostname || tokenInstanceQuery.data.external_app_url }
        </LinkExternal>
      );
    } catch (error) {
      return (
        <LinkExternal href={ tokenInstanceQuery.data.external_app_url } { ...styles }>
            View in app
        </LinkExternal>
      );
    }
  })();

  return (
    <PageTitle.Container>
      <PageTitle.TopRow>
        <TextAd/>
      </PageTitle.TopRow>
      <PageTitle.MainRow>
        <PageTitle.MainContent backLink={ backLink }>
          { nftShieldIcon }
          <Heading as="h1" size="lg" minW={ 0 } h="40px">
            <TruncatedValue
              value={ `${ tokenInstanceQuery.data?.token.name || 'Unnamed token' } #${ tokenInstanceQuery.data?.id }` }
              isLoading={ isLoading }
              maxW={{ base: '100%', lg: '500px', xl: '800px' }}
            />
          </Heading>
        </PageTitle.MainContent>
        <PageTitle.SecondaryContent columnGap={ 3 }>
          { tokenTag }
          { appLink }
        </PageTitle.SecondaryContent>
      </PageTitle.MainRow>
      <PageTitle.BottomRow columnGap={ 6 }>
        <AddressEntity
          address={ address }
          isLoading={ isLoading }
          fontFamily="heading"
          fontSize="lg"
          fontWeight={ 500 }
          mr={{ base: 'auto', lg: 0 }}
        />
        <AddressActionButtons
          address={ address }
          token={ tokenInstanceQuery.data?.token }
          isLoading={ isLoading }
        />
      </PageTitle.BottomRow>
    </PageTitle.Container>
  );
};

export default React.memo(TokenInstancePageTitle);
