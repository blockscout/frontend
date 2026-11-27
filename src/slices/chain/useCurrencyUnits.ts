// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { useMultichainContext } from 'src/features/multichain/context';

import config from 'src/config';

import type { CurrencyUnits } from './units';
import { getCurrencyUnits } from './units';

const APP_CURRENCY_UNITS = getCurrencyUnits(config.chain.currency);

export function useCurrencyUnits(): CurrencyUnits {
  const chainCurrency = useMultichainContext()?.chain.app_config.chain.currency;

  return React.useMemo(() => chainCurrency ? getCurrencyUnits(chainCurrency) : APP_CURRENCY_UNITS, [ chainCurrency ]);
}
