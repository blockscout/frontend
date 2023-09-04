import { Flex, Tooltip } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { Address } from 'types/api/address';
import type { TokenInfo, TokenVerifiedInfo as TTokenVerifiedInfo } from 'types/api/token';

import config from 'configs/app';
import iconVerifiedToken from 'icons/verified_token.svg';
import { useAppContext } from 'lib/contexts/app';
import TextAd from 'ui/shared/ad/TextAd';
import AddressActionButtons from 'ui/shared/AddressActionButtons';
import Icon from 'ui/shared/chakra/Icon';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import EntityTags from 'ui/shared/EntityTags';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import * as PageTitle from 'ui/shared/PageTitle/PageTitle';

import { hasContent as hasProjectInfo } from './TokenProjectInfo/Content';
import TokenVerifiedInfo from './TokenVerifiedInfo';

interface Props {
  tokenQuery: UseQueryResult<TokenInfo>;
  contractQuery: UseQueryResult<Address>;
  verifiedInfoQuery: UseQueryResult<TTokenVerifiedInfo>;
}

const TokenPageTitle = ({ tokenQuery, contractQuery, verifiedInfoQuery }: Props) => {
  const appProps = useAppContext();

  const isLoading = tokenQuery.isPlaceholderData || contractQuery.isPlaceholderData || verifiedInfoQuery.isLoading;

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/tokens');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to tokens list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  const address = {
    hash: tokenQuery.data?.address || '',
    is_contract: true,
    is_verified: contractQuery.data?.is_verified,
    implementation_name: null,
    watchlist_names: [],
    watchlist_address_id: null,
  };

  return (
    <PageTitle.Container>
      <PageTitle.TopRow>
        <TextAd/>
      </PageTitle.TopRow>
      <PageTitle.MainRow>
        <PageTitle.MainContent backLink={ backLink }>
          <TokenEntity
            token={ tokenQuery.data }
            isLoading={ isLoading }
            iconSize="lg"
            noLink
            noCopy
            jointSymbol
            variant="page-title"
            maxW={{ base: '100%', lg: '500px', xl: '800px' }}
          />
        </PageTitle.MainContent>
        <PageTitle.SecondaryContent
          flexWrap={ verifiedInfoQuery.data && (verifiedInfoQuery.data.projectWebsite || hasProjectInfo(verifiedInfoQuery.data)) ? 'wrap' : 'nowrap' }
        >
          <Flex columnGap={ 2 }>
            { verifiedInfoQuery.data?.tokenAddress && (
              <Tooltip label={ `Information on this token has been verified by ${ config.chain.name }` }>
                <Icon
                  as={ iconVerifiedToken }
                  color="green.500"
                  boxSize={ 6 }
                  cursor="pointer"
                  isLoading={ isLoading }
                />
              </Tooltip>
            ) }
            <EntityTags
              data={ contractQuery.data }
              isLoading={ isLoading }
              tagsBefore={ [
                tokenQuery.data ? { label: tokenQuery.data?.type, display_name: tokenQuery.data?.type } : undefined,
              ] }
              tagsAfter={
                verifiedInfoQuery.data?.projectSector ?
                  [ { label: verifiedInfoQuery.data.projectSector, display_name: verifiedInfoQuery.data.projectSector } ] :
                  undefined
              }
              flexShrink={ 0 }
            />
          </Flex>
          <Flex ml={{ base: 0, lg: 'auto' }} w={{ base: '100%', lg: 'auto' }}>
            <TokenVerifiedInfo verifiedInfoQuery={ verifiedInfoQuery } mr={ 2 }/>
            <NetworkExplorers type="token" pathParam={ tokenQuery.data?.address } ml={{ base: 'auto', lg: 0 }} isLoading={ isLoading }/>
          </Flex>
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
          address={ contractQuery.data }
          token={ contractQuery.data?.token }
          isLoading={ isLoading }
        />
      </PageTitle.BottomRow>
    </PageTitle.Container>
  );
};

export default React.memo(TokenPageTitle);
