// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, useToken } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import AdBanner from 'src/features/ads/banner/components/AdBanner';
import essentialDappsChainsConfig from 'src/features/marketplace/chains-config/essential-dapps';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';
import useIsMobile from 'src/shared/hooks/useIsMobile';

import { useColorMode } from 'src/toolkit/chakra/color-mode';
import { BODY_TYPEFACE } from 'src/toolkit/theme/foundations/typography';

import MarketplaceAppIframe from '../../../components/MarketplaceAppIframe';

const feature = getFeaturePayload(config.features.marketplace);
const dappConfig = feature?.essentialDapps?.swap;

const defaultChainId = Number(
  dappConfig?.chains.includes(config.chain.id as string) ?
    config.chain.id :
    dappConfig?.chains[0],
);

function getExplorerUrls() {
  return Object.fromEntries(dappConfig?.chains.map((chainId) => {
    const chainConfig = essentialDappsChainsConfig()?.chains.find(
      (chain) => chain.id === chainId,
    );
    return [ Number(chainId), [ chainConfig?.explorer_url ] ];
  }) || []);
}

export default function Swap() {
  const isMobile = useIsMobile();
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
    defaultChainId,
  }), [ mainColor, borderColor ]);

  return (
    <Flex flex="1" flexDir="column" justifyContent="space-between" gap={ 6 }>
      <MarketplaceAppIframe
        appId="swap"
        appUrl={ dappConfig?.url }
        message={ message }
        isEssentialDapp
      />
      { (feature?.essentialDappsAdEnabled && !isMobile) && (
        <AdBanner
          format="mobile"
          w="fit-content"
          borderRadius="md"
          overflow="hidden"
          ml="auto"
        />
      ) }
    </Flex>
  );
};
