import { useColorMode } from '@chakra-ui/react';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';
import { createWeb3Modal, useWeb3ModalTheme, defaultWagmiConfig } from '@web3modal/wagmi/react';
import React from 'react';
import { configureChains, WagmiConfig } from 'wagmi';

import config from 'configs/app';
import currentChain from 'lib/web3/currentChain';
import colors from 'theme/foundations/colors';
import { BODY_TYPEFACE } from 'theme/foundations/typography';
import zIndices from 'theme/foundations/zIndices';

const feature = config.features.blockchainInteraction;

const getConfig = () => {
  try {
    if (!feature.isEnabled) {
      throw new Error();
    }

    const { chains } = configureChains(
      [ currentChain ],
      [
        jsonRpcProvider({
          rpc: () => ({
            http: config.chain.rpcUrl || '',
          }),
        }),
      ],
    );

    const wagmiConfig = defaultWagmiConfig({
      chains,
      projectId: feature.walletConnect.projectId,
    });

    createWeb3Modal({
      wagmiConfig,
      projectId: feature.walletConnect.projectId,
      chains,
      themeVariables: {
        '--w3m-font-family': `${ BODY_TYPEFACE }, sans-serif`,
        '--w3m-accent': colors.blue[600],
        '--w3m-border-radius-master': '2px',
        '--w3m-z-index': zIndices.modal,
      },
    });

    return { wagmiConfig };
  } catch (error) {
    return { };
  }
};

const { wagmiConfig } = getConfig();

interface Props {
  children: React.ReactNode;
  fallback?: JSX.Element | (() => JSX.Element);
}

const Fallback = ({ children, fallback }: Props) => {
  return typeof fallback === 'function' ? fallback() : (fallback || <>{ children }</>); // eslint-disable-line react/jsx-no-useless-fragment
};

const Provider = ({ children, fallback }: Props) => {
  const { colorMode } = useColorMode();
  const { setThemeMode } = useWeb3ModalTheme();

  React.useEffect(() => {
    setThemeMode(colorMode);
  }, [ colorMode, setThemeMode ]);

  // not really necessary, but we have to make typescript happy
  if (!wagmiConfig || !feature.isEnabled) {
    return <Fallback fallback={ fallback }>{ children }</Fallback>;
  }

  return (
    <WagmiConfig config={ wagmiConfig }>
      { children }
    </WagmiConfig>
  );
};

const Web3ModalProvider = wagmiConfig && feature.isEnabled ? Provider : Fallback;

export default Web3ModalProvider;
