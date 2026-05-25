// SPDX-License-Identifier: LicenseRef-Blockscout

import type { BoxProps } from '@chakra-ui/react';
import React from 'react';

import type { TokenInfo } from 'client/slices/token/types/api';

import type { EntityProps as TokenEntityProps } from 'client/slices/token/components/entity/TokenEntity';
import TokenEntity from 'client/slices/token/components/entity/TokenEntity';

import TokenEntityL1 from 'client/features/rollup/common/components/TokenEntityL1';

import type { Props as AssetValueProps } from './AssetValue';
import AssetValue from './AssetValue';

interface Props extends Omit<AssetValueProps, 'asset'> {
  token: TokenInfo;
  tokenEntityProps?: Omit<TokenEntityProps, 'token'> & BoxProps;
  layer?: 'L1';
}

const TokenValue = ({ token, tokenEntityProps, layer, ...rest }: Props) => {
  const TokenComponent = layer === 'L1' ? TokenEntityL1 : TokenEntity;

  const asset = (
    <TokenComponent
      token={ token }
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
      exchangeRate={ token.exchange_rate }
      decimals={ token.decimals }
      { ...rest }
    />
  );
};

export default React.memo(TokenValue);
