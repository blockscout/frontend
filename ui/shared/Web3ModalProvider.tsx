import { useColorMode } from '@chakra-ui/react';
import { createAppKit, useAppKitTheme } from '@reown/appkit/react';
import React from 'react';
import { WagmiProvider } from 'wagmi';

import config from 'configs/app';
import currentChain from 'lib/web3/currentChain';
import wagmiConfig from 'lib/web3/wagmiConfig';
import colors from 'theme/foundations/colors';
import { BODY_TYPEFACE } from 'theme/foundations/typography';
import zIndices from 'theme/foundations/zIndices';

const feature = config.features.blockchainInteraction;

const init = () => {
  try {
    if (!feature.isEnabled || !wagmiConfig.adapter) {
      return;
    }

    createAppKit({
      adapters: [ wagmiConfig.adapter ],
      networks: [ currentChain ],
      metadata: {
        name: `${ config.chain.name } explorer`,
        description: `${ config.chain.name } explorer`,
        url: config.app.baseUrl,
        icons: [ config.UI.navigation.icon.default ].filter(Boolean),
      },
      projectId: feature.walletConnect.projectId,
      features: {
        analytics: false,
        email: true,
        socials: [],
        onramp: false,
        swaps: false,
      },
      themeVariables: {
        '--w3m-font-family': `${ BODY_TYPEFACE }, sans-serif`,
        '--w3m-accent': colors.blue[600],
        '--w3m-border-radius-master': '2px',
        '--w3m-z-index': zIndices.popover,
      },
      featuredWalletIds: [],
      allowUnsupportedChain: true,
    });
  } catch (error) {}
};

init();

interface Props {
  children: React.ReactNode;
}

const DefaultProvider = ({ children }: Props) => {
  return (
    <WagmiProvider config={ wagmiConfig.config }>
      { children }
    </WagmiProvider>
  );
};

const Web3ModalProvider = ({ children }: Props) => {
  const { colorMode } = useColorMode();
  const { setThemeMode } = useAppKitTheme();

  React.useEffect(() => {
    setThemeMode(colorMode);
  }, [ colorMode, setThemeMode ]);

  return (
    <DefaultProvider>
      { children }
    </DefaultProvider>
  );
};

const Provider = feature.isEnabled ? Web3ModalProvider : DefaultProvider;

export default Provider;
