import { Icon } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'types/api/token';

import iconSuccess from 'icons/status/success.svg';
import Tag from 'ui/shared/chakra/Tag';
import EntityTags from 'ui/shared/EntityTags';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import TokenLogo from 'ui/shared/TokenLogo';

import PageTitle from '../PageTitle';

const DefaultView = () => {
  const tokenData: TokenInfo = {
    address: '0x363574E6C5C71c343d7348093D84320c76d5Dd29',
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
    <EntityTags
      tagsBefore={ [
        { label: 'example', display_name: 'Example label' },
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

  return (
    <PageTitle
      title="Shavukha Token (SHVKH) token"
      beforeTitle={ (
        <TokenLogo data={ tokenData } boxSize={ 6 } display="inline-block" mr={ 2 }/>
      ) }
      afterTitle={ <Icon as={ iconSuccess } color="green.500" boxSize={ 4 } verticalAlign="top"/> }
      backLink={ backLink }
      contentAfter={ contentAfter }
    />
  );
};

export default DefaultView;
