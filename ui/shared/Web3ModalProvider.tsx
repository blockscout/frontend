import { useColorMode } from '@chakra-ui/react';
import { createWeb3Modal, useWeb3ModalTheme } from '@web3modal/wagmi/react';
import React from 'react';
import { WagmiProvider } from 'wagmi';

import config from 'configs/app';
import wagmiConfig from 'lib/web3/wagmiConfig';
import colors from 'theme/foundations/colors';
import { BODY_TYPEFACE } from 'theme/foundations/typography';
import zIndices from 'theme/foundations/zIndices';

const feature = config.features.blockchainInteraction;

const init = () => {
  try {
    if (!feature.isEnabled) {
      return;
    }

    createWeb3Modal({
      wagmiConfig,
      projectId: feature.walletConnect.projectId,
      themeVariables: {
        '--w3m-font-family': `${ BODY_TYPEFACE }, sans-serif`,
        '--w3m-accent': colors.blue[600],
        '--w3m-border-radius-master': '2px',
        '--w3m-z-index': zIndices.modal,
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
    <WagmiProvider config={ wagmiConfig }>
      { children }
    </WagmiProvider>
  );
};

const Web3ModalProvider = ({ children }: Props) => {
  const { colorMode } = useColorMode();
  const { setThemeMode } = useWeb3ModalTheme();

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
