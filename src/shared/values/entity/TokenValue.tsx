// SPDX-License-Identifier: LicenseRef-Blockscout

import type { BoxProps } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import type { EntityProps as TokenEntityProps } from 'src/slices/token/components/entity/TokenEntity';
import TokenEntity from 'src/slices/token/components/entity/TokenEntity';

import TokenEntityL1 from 'src/features/rollup/common/components/TokenEntityL1';

import type { Props as AssetValueProps } from './AssetValue';
import AssetValue from './AssetValue';

interface Props extends Omit<AssetValueProps, 'asset'> {
  token: schemas['Token'];
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
