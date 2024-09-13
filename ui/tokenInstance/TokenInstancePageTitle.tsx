import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo, TokenInstance } from 'types/api/token';

import { useAppContext } from 'lib/contexts/app';
import * as regexp from 'lib/regexp';
import { getTokenTypeName } from 'lib/token/tokenTypes';
import AddressQrCode from 'ui/address/details/AddressQrCode';
import AccountActionsMenu from 'ui/shared/AccountActionsMenu/AccountActionsMenu';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import Tag from 'ui/shared/chakra/Tag';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import LinkExternal from 'ui/shared/links/LinkExternal';
import PageTitle from 'ui/shared/Page/PageTitle';

interface Props {
  isLoading: boolean;
  token: TokenInfo | undefined;
  instance: TokenInstance | undefined;
  hash: string | undefined;
}

const TokenInstancePageTitle = ({ isLoading, token, instance, hash }: Props) => {
  const appProps = useAppContext();

  const title = (() => {
    if (typeof instance?.metadata?.name === 'string') {
      return instance.metadata.name;
    }

    if (!instance) {
      return `Unknown token instance`;
    }

    if (token?.name || token?.symbol) {
      return (token.name || token.symbol) + ' #' + instance.id;
    }

    return `ID ${ instance.id }`;
  })();

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

  const tokenTag = token ? <Tag isLoading={ isLoading }>{ getTokenTypeName(token.type) }</Tag> : null;

  const appLink = (() => {
    if (!instance?.external_app_url) {
      return null;
    }

    try {
      const url = regexp.URL_PREFIX.test(instance.external_app_url) ?
        new URL(instance.external_app_url) :
        new URL('https://' + instance.external_app_url);

      return (
        <LinkExternal href={ url.toString() } variant="subtle" isLoading={ isLoading } ml={{ base: 0, lg: 'auto' }}>
          { url.hostname || instance.external_app_url }
        </LinkExternal>
      );
    } catch (error) {
      return (
        <LinkExternal href={ instance.external_app_url } isLoading={ isLoading } ml={{ base: 0, lg: 'auto' }}>
            View in app
        </LinkExternal>
      );
    }
  })();

  const address = {
    hash: hash || '',
    is_contract: true,
    implementations: null,
    watchlist_names: [],
    watchlist_address_id: null,
  };

  const titleSecondRow = (
    <Flex alignItems="center" w="100%" minW={ 0 } columnGap={ 2 } rowGap={ 2 } flexWrap={{ base: 'wrap', lg: 'nowrap' }}>
      { token && (
        <TokenEntity
          token={ token }
          isLoading={ isLoading }
          noSymbol
          noCopy
          jointSymbol
          fontFamily="heading"
          fontSize="lg"
          fontWeight={ 500 }
          w="auto"
          maxW="700px"
        />
      ) }
      { !isLoading && <AddressAddToWallet token={ token } variant="button"/> }
      <AddressQrCode address={ address } isLoading={ isLoading }/>
      <AccountActionsMenu isLoading={ isLoading } showUpdateMetadataItem={ Boolean(instance?.metadata) }/>
      { appLink }
    </Flex>
  );

  return (
    <PageTitle
      title={ title }
      backLink={ backLink }
      contentAfter={ tokenTag }
      secondRow={ titleSecondRow }
      isLoading={ isLoading }
    />
  );
};

export default React.memo(TokenInstancePageTitle);
