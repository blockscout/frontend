// SPDX-License-Identifier: LicenseRef-Blockscout

/* eslint-disable max-len */
import React from 'react';

import * as TokenEntity from 'src/slices/token/components/entity/TokenEntity';
import { toTokenModel } from 'src/slices/token/utils/model';

import { publicTag, privateTag, watchlistName } from 'src/features/account/mocks/address-tags';
import formatAccountTags from 'src/features/address-metadata/components/tag/format-account-tags';
import MetadataTags from 'src/features/address-metadata/components/tag/MetadataTags';

import SpriteIcon from 'src/sprite/SpriteIcon';

import PageTitle from '../PageTitle';

const LongNameAndManyTags = () => {
  const tokenData = toTokenModel({
    address_hash: '0xa77A39CC9680B10C00af5D4ABFc92e1F07406c64',
    circulating_market_cap: null,
    decimals: null,
    exchange_rate: null,
    holders_count: '294',
    icon_url: null,
    name: 'Ring ding ding daa baa Baa aramba baa bom baa barooumba Wh-wha-what&#39;s going on-on? Ding, ding This is the Crazy Frog Ding, ding Bem, bem! Ring ding ding ding ding ding Ring ding ding ding bem bem bem Ring ding ding ding ding ding Ring ding ding ding baa b',
    symbol: 'BatcoiRing ding ding daa baa Baa aramba baa bom baa barooumba Wh-wha-what&#39;s going on-on? Ding, ding This is the Crazy Frog Ding, ding Bem, bem! Ring ding ding ding ding ding Ring ding ding ding bem bem bem Ring ding ding ding ding ding Ring ding ding ding',
    total_supply: '13747',
    type: 'ERC-721',
    reputation: 'ok',
  });

  const contentAfter = (
    <>
      <SpriteIcon name="certified" color="green.500" boxSize={ 6 } cursor="pointer" flexShrink={ 0 }/>
      <MetadataTags
        tags={ [
          { slug: 'example', name: 'Example with long name', tagType: 'custom', ordinal: 0 },
          ...formatAccountTags({
            private_tags: [ privateTag ],
            public_tags: [ publicTag ],
            watchlist_names: [ watchlistName ],
          }),
          { slug: 'after_1', name: 'Another tag', tagType: 'custom', ordinal: 0 },
          { slug: 'after_2', name: 'And yet more', tagType: 'custom', ordinal: 0 },
        ] }
        flexGrow={ 1 }
      />
    </>
  );

  const tokenSymbolText = ` (${ tokenData.symbol })`;

  return (
    <PageTitle
      title={ `${ tokenData?.name }${ tokenSymbolText } token` }
      beforeTitle={ (
        <TokenEntity.Icon
          token={ tokenData }
          variant="heading"
        />
      ) }
      contentAfter={ contentAfter }
    />
  );
};

export default LongNameAndManyTags;
