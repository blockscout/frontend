import { useToken } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import config from 'configs/app';
import essentialDappsChainsConfig from 'configs/essential-dapps-chains';
import { useColorMode } from 'toolkit/chakra/color-mode';
import { BODY_TYPEFACE } from 'toolkit/theme/foundations/typography';
import MarketplaceAppIframe from 'ui/marketplace/MarketplaceAppIframe';

const feature = config.features.marketplace;
const dappConfig = feature.isEnabled ? feature.essentialDapps?.swap : undefined;

function getExplorerUrls() {
  return Object.fromEntries(dappConfig?.chains.map((chainId) => {
    const chainConfig = essentialDappsChainsConfig()?.chains.find(
      (chain) => chain.id === chainId,
    );
    return [ Number(chainId), [ chainConfig?.explorer_url ] ];
  }) || []);
}

export default function Swap() {
  const { colorMode } = useColorMode();
  const [ mainColor ] = useToken('colors', 'blue.600');
  const [ borderColor ] = useToken('colors', colorMode === 'light' ? 'blackAlpha.100' : 'whiteAlpha.100');

  const message = useMemo(() => ({
    type: 'config',
    integrator: dappConfig?.integrator,
    fee: Number(dappConfig?.fee),
    chains: dappConfig?.chains.map((chainId) => Number(chainId)),
    explorerUrls: getExplorerUrls(),
    mainColor,
    borderColor,
    fontFamily: BODY_TYPEFACE,
    initialChainId: Number(config.chain.id),
  }), [ mainColor, borderColor ]);

  return (
    <MarketplaceAppIframe
      appId="swap"
      appUrl={ dappConfig?.url }
      message={ message }
      isAdaptiveHeight
    />
  );
};
