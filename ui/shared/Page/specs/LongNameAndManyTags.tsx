/* eslint-disable max-len */
import { Icon } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import iconSuccess from 'icons/status/success.svg';
import trimTokenSymbol from 'lib/token/trimTokenSymbol';
import { publicTag, privateTag, watchlistName } from 'mocks/address/tag';
import Tag from 'ui/shared/chakra/Tag';
import EntityTags from 'ui/shared/EntityTags';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import TokenLogo from 'ui/shared/TokenLogo';

import PageTitle from '../PageTitle';

const LongNameAndManyTags = () => {
  const tokenData: TokenInfo = {
    address: '0xa77A39CC9680B10C00af5D4ABFc92e1F07406c64',
    decimals: null,
    exchange_rate: null,
    holders: '294',
    icon_url: null,
    name: 'Ring ding ding daa baa Baa aramba baa bom baa barooumba Wh-wha-what&#39;s going on-on? Ding, ding This is the Crazy Frog Ding, ding Bem, bem! Ring ding ding ding ding ding Ring ding ding ding bem bem bem Ring ding ding ding ding ding Ring ding ding ding baa b',
    symbol: 'BatcoiRing ding ding daa baa Baa aramba baa bom baa barooumba Wh-wha-what&#39;s going on-on? Ding, ding This is the Crazy Frog Ding, ding Bem, bem! Ring ding ding ding ding ding Ring ding ding ding bem bem bem Ring ding ding ding ding ding Ring ding ding ding',
    total_supply: '13747',
    type: 'ERC-721',
  };

  const contentAfter = (
    <EntityTags
      data={{
        private_tags: [ privateTag ],
        public_tags: [ publicTag ],
        watchlist_names: [ watchlistName ],
      }}
      tagsBefore={ [
        { label: 'example', display_name: 'Example with long name' },
      ] }
      tagsAfter={ [
        { label: 'after_1', display_name: 'Another tag' },
        { label: 'after_2', display_name: 'And yet more' },
      ] }
      contentAfter={ (
        <>
          <Tag key="custom" colorScheme="orange" variant="solid">Awesome</Tag>
          <NetworkExplorers type="token" pathParam="token-hash" ml="auto"/>
        </>
      ) }
      flexGrow={ 1 }
    />
  );

  const tokenSymbolText = ` (${ trimTokenSymbol(tokenData.symbol) })`;

  return (
    <PageTitle
      title={ `${ tokenData?.name }${ tokenSymbolText } token` }
      beforeTitle={ (
        <TokenLogo data={ tokenData } boxSize={ 6 } display="inline-block" mr={ 2 }/>
      ) }
      afterTitle={ <Icon as={ iconSuccess } color="green.500" boxSize={ 4 } verticalAlign="top"/> }
      contentAfter={ contentAfter }
    />
  );
};

export default LongNameAndManyTags;
