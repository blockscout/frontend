// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { useMultichainContext } from 'src/features/multichain/context';

import config from 'src/config';

type TxReceiptChainConfig = Pick<typeof config.chain, 'name' | 'logo' | 'currency'>;

// a chain's config carries its assets as paths on its own explorer, which the multichain explorer does not serve
function resolveChainAssetUrl(path: string | undefined, chainBaseUrl: string): string | undefined {
  return path ? new URL(path, chainBaseUrl).toString() : undefined;
}

export function useTxReceiptChainConfig(): TxReceiptChainConfig {
  const chain = useMultichainContext()?.chain;

  return React.useMemo(() => {
    if (!chain) {
      return config.chain;
    }

    const { app, chain: chainConfig } = chain.app_config;
    return {
      name: chainConfig.name,
      currency: chainConfig.currency,
      logo: {
        'default': resolveChainAssetUrl(chainConfig.logo.default, app.baseUrl),
        dark: resolveChainAssetUrl(chainConfig.logo.dark, app.baseUrl),
      },
    };
  }, [ chain ]);
}
