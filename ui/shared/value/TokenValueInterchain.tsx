import type { BoxProps } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from '@blockscout/interchain-indexer-types';
import type { ExternalChain } from 'types/externalChains';

import type { EntityProps as TokenEntityProps } from 'ui/shared/entities/token/TokenEntity';
import TokenEntityInterchain from 'ui/shared/entities/token/TokenEntityInterchain';

import type { Props as AssetValueProps } from './AssetValue';
import AssetValue from './AssetValue';

interface Props extends Omit<AssetValueProps, 'asset'> {
  token: TokenInfo;
  chainId: string;
  chains: Array<ExternalChain> | undefined;
  tokenEntityProps?: Omit<TokenEntityProps, 'token'> & BoxProps;
}

const TokenValueInterchain = ({ token, tokenEntityProps, chainId, chains, ...rest }: Props) => {

  const tokenInfo = React.useMemo(() => {
    return {
      symbol: token.symbol ?? null,
      address_hash: token.address,
      icon_url: token.icon_url ?? null,
      name: token.name ?? null,
      type: 'ERC-20',
      reputation: null,
    };
  }, [ token.address, token.icon_url, token.name, token.symbol ]);

  const asset = (
    <TokenEntityInterchain
      token={ tokenInfo }
      chainId={ chainId }
      chains={ chains }
      noCopy
      onlySymbol
      flexShrink={ 0 }
      w="fit-content"
      ml={ 2 }
      icon={{ marginRight: 1 }}
      { ...tokenEntityProps }
    />
  );
  return (
    <AssetValue
      asset={ asset }
      decimals={ token.decimals }
      { ...rest }
    />
  );
};

export default React.memo(TokenValueInterchain);
