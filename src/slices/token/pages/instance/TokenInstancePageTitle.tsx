// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';
import { getTokenTypeName } from 'src/slices/token/utils/token-types';

import ActionsMenu from 'src/shell/page/actions-menu/ActionsMenu';
import PageTitle from 'src/shell/page/title/PageTitle';

import AddressQrCode from 'src/slices/address/pages/details/info/AddressQrCode';
import TokenEntity from 'src/slices/token/components/entity/TokenEntity';

import AppActionButton from 'src/features/address-metadata/components/AppActionButton';
import useAppActionData from 'src/features/address-metadata/hooks/useAppActionData';
import { useMultichainContext } from 'src/features/multichain/context';
import TokenAddToWallet from 'src/features/web3-wallet/components/TokenAddToWallet';

import { Link } from 'src/toolkit/chakra/link';
import { Tag } from 'src/toolkit/chakra/tag';
import * as regexp from 'src/toolkit/utils/regexp';

interface Props {
  isLoading: boolean;
  token: schemas['Token'] | undefined;
  instance: schemas['TokenInstance'] | undefined;
  hash: string | undefined;
}

const TokenInstancePageTitle = ({ isLoading, token, instance, hash }: Props) => {
  const multichainContext = useMultichainContext();
  const appActionData = useAppActionData(token?.address_hash, !isLoading);

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

  const contentAfter = (
    <>
      { token && <Tag loading={ isLoading }>{ getTokenTypeName(token.type) }</Tag> }
      { appActionData && (
        <AppActionButton
          data={ appActionData }
          addressHash={ token?.address_hash }
          source="NFT item"
          ml={{ base: 0, lg: 'auto' }}
        />
      ) }
    </>
  );

  const appLink = (() => {
    if (!instance?.external_app_url) {
      return null;
    }

    try {
      const url = regexp.URL_PREFIX.test(instance.external_app_url) ?
        new URL(instance.external_app_url) :
        new URL('https://' + instance.external_app_url);

      return (
        <Link external href={ url.toString() } variant="underlaid" loading={ isLoading } ml={{ base: 0, lg: 'auto' }}>
          { url.hostname || instance.external_app_url }
        </Link>
      );
    } catch (error) {
      return (
        <Link external href={ instance.external_app_url } variant="underlaid" loading={ isLoading } ml={{ base: 0, lg: 'auto' }}>
          View in app
        </Link>
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
          variant="subheading"
          w="auto"
          maxW="700px"
          chain={ multichainContext?.chain }
        />
      ) }
      { !isLoading && token && <TokenAddToWallet token={ token } tokenId={ instance?.id } variant="button"/> }
      <AddressQrCode hash={ address.hash } isLoading={ isLoading }/>
      <ActionsMenu isLoading={ isLoading } showUpdateMetadataItem/>
      { appLink }
    </Flex>
  );

  return (
    <PageTitle
      title={ title }
      contentAfter={ contentAfter }
      secondRow={ titleSecondRow }
      isLoading={ isLoading }
    />
  );
};

export default React.memo(TokenInstancePageTitle);
