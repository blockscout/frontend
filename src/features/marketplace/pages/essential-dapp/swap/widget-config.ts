// SPDX-License-Identifier: LicenseRef-Blockscout

import type { WidgetLightConfig } from '@lifi/widget-light';
import { zeroAddress } from 'viem';

import type { EssentialDappsChainConfig, EssentialDappsConfig } from 'src/features/marketplace/types/client';

export function getSwapWidgetConfig(
  swap: NonNullable<EssentialDappsConfig['swap']>,
  chainId: string | undefined,
  chainConfigs: Array<EssentialDappsChainConfig>,
): WidgetLightConfig {
  const chains = swap.chains.map(Number);
  const explorerUrls = Object.fromEntries(chainConfigs.flatMap((chain) =>
    swap.chains.includes(chain.id) && chain.explorer_url ? [ [ Number(chain.id), [ chain.explorer_url ] ] ] : [],
  ));

  return {
    integrator: swap.integrator,
    feeConfig: { fee: Number(swap.fee) },
    chains: { allow: chains },
    fromChain: chains.includes(Number(chainId)) ? Number(chainId) : chains[0],
    fromToken: zeroAddress,
    explorerUrls,
    variant: 'compact',
    mode: 'default',
    hiddenUI: { appearance: true, language: true, gasRefuelMessage: true },
  };
}
