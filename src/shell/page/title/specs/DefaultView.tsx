// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import * as addressParamMock from 'src/slices/address/mocks/address-param';
import * as TokenEntity from 'src/slices/token/components/entity/TokenEntity';
import { toTokenModel } from 'src/slices/token/utils/model';

import MetadataTags from 'src/features/address-metadata/components/tag/MetadataTags';
import AlternativeExplorers from 'src/features/alternative-explorers/components/AlternativeExplorers';

import SpriteIcon from 'src/sprite/SpriteIcon';

import PageTitle from '../PageTitle';

const DefaultView = () => {
  const tokenData = toTokenModel({
    address_hash: '0x363574E6C5C71c343d7348093D84320c76d5Dd29',
    circulating_market_cap: '117629601.61913824',
    type: 'ERC-20',
    symbol: 'SHAAAAAAAAAAAAA',
    name: null,
    decimals: '18',
    holders_count: '1',
    exchange_rate: null,
    total_supply: null,
    icon_url: 'https://example.com/logo.png',
    reputation: 'ok',
  });

  const contentAfter = (
    <>
      <SpriteIcon name="certified" color="green.500" boxSize={ 6 } cursor="pointer"/>
      <MetadataTags
        tags={ [
          { slug: 'example', name: 'Example label', tagType: 'custom', ordinal: 0 },
        ] }
        flexGrow={ 1 }
      />
    </>
  );

  const secondRow = (
    <>
      <AddressEntity
        address={ addressParamMock.withoutName }
        variant="subheading"
      />
      <AlternativeExplorers type="token" pathParam={ addressParamMock.hash } ml="auto"/>
    </>
  );

  return (
    <PageTitle
      title="Shavukha Token (SHVKH) token"
      beforeTitle={ (
        <TokenEntity.Icon
          token={ tokenData }
          variant="heading"
        />
      ) }
      contentAfter={ contentAfter }
      secondRow={ secondRow }
    />
  );
};

export default DefaultView;
