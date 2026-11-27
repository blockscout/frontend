// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { useCurrencyUnits } from 'src/slices/chain/useCurrencyUnits';
import { toTokenModel } from 'src/slices/token/utils/model';

import { useMultichainContext } from 'src/features/multichain/context';

import config from 'src/config';

import { NATIVE_TOKEN_ADDRESS_HASH } from '../utils/consts';

export function useNativeToken(): schemas['Token'] {
  const chainCurrency = useMultichainContext()?.chain.app_config.chain.currency ?? config.chain.currency;
  const symbol = useCurrencyUnits().ether;

  return React.useMemo(() => toTokenModel({
    name: chainCurrency.name || '',
    icon_url: '',
    symbol,
    address_hash: NATIVE_TOKEN_ADDRESS_HASH,
    type: 'ERC-20',
  }), [ chainCurrency.name, symbol ]);
}
