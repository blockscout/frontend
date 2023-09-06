import { Icon } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import iconVerifiedToken from 'icons/verified_token.svg';
import useIsMobile from 'lib/hooks/useIsMobile';
import * as TokenEntity from 'ui/shared/entities/token/TokenEntity';
import EntityTags from 'ui/shared/EntityTags';
import NetworkExplorers from 'ui/shared/NetworkExplorers';

import PageTitle from '../PageTitle';

const DefaultView = () => {
  const isMobile = useIsMobile();

  const tokenData: TokenInfo = {
    address: '0x363574E6C5C71c343d7348093D84320c76d5Dd29',
    circulating_market_cap: '117629601.61913824',
    type: 'ERC-20',
    symbol: 'SHAAAAAAAAAAAAA',
    name: null,
    decimals: '18',
    holders: '1',
    exchange_rate: null,
    total_supply: null,
    icon_url: 'https://example.com/logo.png',
  };

  const backLink = {
    label: 'Back to tokens list',
    url: 'https://localhost:3000/tokens',
  };

  const contentAfter = (
    <>
      <Icon as={ iconVerifiedToken } color="green.500" boxSize={ 6 } cursor="pointer"/>
      <EntityTags
        tagsBefore={ [
          { label: 'example', display_name: 'Example label' },
        ] }
        contentAfter={ <NetworkExplorers type="token" pathParam="token-hash" ml="auto" hideText={ isMobile }/> }
        flexGrow={ 1 }
      />
    </>
  );

  return (
    <PageTitle
      title="Shavukha Token (SHVKH) token"
      beforeTitle={ (
        <TokenEntity.Icon
          token={ tokenData }
          iconSize="lg"
        />
      ) }
      backLink={ backLink }
      contentAfter={ contentAfter }
    />
  );
};

export default DefaultView;
