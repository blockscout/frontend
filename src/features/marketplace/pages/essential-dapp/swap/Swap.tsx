// SPDX-License-Identifier: LicenseRef-Blockscout

import { Center, Flex, useToken } from '@chakra-ui/react';
import React, { useMemo } from 'react';

import AdBanner from 'src/features/ads/banner/components/AdBanner';
import Web3Boundary from 'src/features/connect-wallet/components/Web3Boundary';
import useWeb3Wallet from 'src/features/connect-wallet/hooks/useWallet';
import essentialDappsChainsConfig from 'src/features/marketplace/chains-config/essential-dapps';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';
import useIsMobile from 'src/shared/hooks/useIsMobile';

import { useColorMode } from 'src/toolkit/chakra/color-mode';
import { ContentLoader } from 'src/toolkit/components/loaders/ContentLoader';
import { BODY_TYPEFACE } from 'src/toolkit/theme/foundations/typography';

import { SWAP_WIDGET_MIN_HEIGHT } from './consts';
import SwapWidgetIframe from './SwapWidgetIframe';
import { useSwapWallet } from './useSwapWallet';
import { getSwapWidgetConfig } from './widget-config';

const feature = getFeaturePayload(config.features.marketplace);
const dappConfig = feature?.essentialDapps?.swap;

const widgetConfig = dappConfig ? getSwapWidgetConfig(dappConfig, config.chain.id, essentialDappsChainsConfig()?.chains ?? []) : undefined;

const SwapWidget = () => {
  const { colorMode } = useColorMode();
  const [ mainColor ] = useToken('colors', 'blue.600');
  const [ borderColor ] = useToken('colors', colorMode === 'light' ? 'blackAlpha.100' : 'whiteAlpha.100');
  const [ borderRadius, borderRadiusSecondary ] = useToken('radii', [ 'md', 'base' ]);
  const wallet = useWeb3Wallet({ source: 'Essential dapps' });
  const handler = useSwapWallet();
  const handlers = useMemo(() => [ handler ], [ handler ]);
  const themedConfig = useMemo(() => widgetConfig && ({
    ...widgetConfig,
    // The iframe's CSS color-scheme follows our theme, including changes during an active swap.
    appearance: 'system' as const,
    // widget-light omits these serializable MUI fields from its types; the hosted widget forwards them unchanged.
    theme: {
      typography: { fontFamily: BODY_TYPEFACE },
      colorSchemes: {
        light: { palette: { primary: { main: mainColor }, secondary: { main: mainColor } } },
        dark: { palette: { primary: { main: mainColor }, secondary: { main: mainColor } } },
      },
      shape: {
        borderRadius: Number.parseInt(borderRadius, 10),
        borderRadiusSecondary: Number.parseInt(borderRadiusSecondary, 10),
      },
      container: { height: 'fit-content', border: `1px solid ${ borderColor }`, borderRadius },
    },
  }), [ mainColor, borderColor, borderRadius, borderRadiusSecondary ]);

  if (!themedConfig) {
    return null;
  }

  return (
    <SwapWidgetIframe
      config={ themedConfig }
      handlers={ handlers }
      onConnect={ wallet.connect }
    />
  );
};

export default function Swap() {
  const isMobile = useIsMobile();

  return (
    <Flex flex="1" flexDir="column" justifyContent="space-between" gap={ 6 }>
      <Web3Boundary fallback={ <Center h={ SWAP_WIDGET_MIN_HEIGHT }><ContentLoader/></Center> }>
        <SwapWidget/>
      </Web3Boundary>
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
