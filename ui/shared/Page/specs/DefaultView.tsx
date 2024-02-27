import React from 'react';

import type { TokenInfo } from 'types/api/token';

import * as addressMock from 'mocks/address/address';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import * as TokenEntity from 'ui/shared/entities/token/TokenEntity';
import EntityTags from 'ui/shared/EntityTags';
import IconSvg from 'ui/shared/IconSvg';
import NetworkExplorers from 'ui/shared/NetworkExplorers';

import PageTitle from '../PageTitle';

const DefaultView = () => {
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
      <IconSvg name="verified_token" color="green.500" boxSize={ 6 } cursor="pointer"/>
      <EntityTags
        tagsBefore={ [
          { label: 'example', display_name: 'Example label' },
        ] }
        flexGrow={ 1 }
      />
    </>
  );

  const secondRow = (
    <>
      <AddressEntity
        address={{ ...addressMock.token, name: '' }}
        fontFamily="heading"
        fontSize="lg"
        fontWeight={ 500 }
      />
      <NetworkExplorers type="token" pathParam={ addressMock.hash } ml="auto"/>
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
      secondRow={ secondRow }
    />
  );
};

export default DefaultView;
