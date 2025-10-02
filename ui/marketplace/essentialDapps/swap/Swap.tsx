import { Box } from '@chakra-ui/react';
import type { WidgetConfig } from '@lifi/widget';
import { LiFiWidget } from '@lifi/widget';
import { useMemo } from 'react';

import config from 'configs/app';
import essentialDappsChains from 'configs/essentialDappsChains';
import useWeb3Wallet from 'lib/web3/useWallet';
import { useColorMode } from 'toolkit/chakra/color-mode';

import essentialDappsConfig from '../config';

const defaultChainId = Number(
  essentialDappsConfig.revoke.chains.includes(config.chain.id as string) ?
    config.chain.id :
    essentialDappsConfig.revoke.chains[0],
);

const Swap = () => {
  const web3Wallet = useWeb3Wallet({ source: 'Swap' });
  const { colorMode } = useColorMode();

  const config = useMemo(
    () =>
      ({
        fee: 0.004, // 0.4% instead of 0.075%
        variant: 'compact',
        subvariant: 'default',
        appearance: colorMode,
        theme: {
          typography: { fontFamily: 'var(--chakra-fonts-body)' },
          shape: {
            borderRadius: 12,
            borderRadiusSecondary: 8,
          },
          palette: {
            primary: { main: '#2B6CB0' },
            secondary: { main: '#2B6CB0' },
          },
        },
        fromChain: defaultChainId,
        fromToken: '0x0000000000000000000000000000000000000000',
        chains: {
          allow: essentialDappsConfig.multisend.chains.map((chainId) => Number(chainId)),
        },
        sdkConfig: {
          rpcUrls: Object.fromEntries(essentialDappsConfig.multisend.chains.map((chainId) => ([
            Number(chainId),
            [ `${ essentialDappsChains[chainId] }/api/eth-rpc` ],
          ]))),
        },
        walletConfig: {
          onConnect: web3Wallet.connect,
        },
      } as Partial<WidgetConfig>),
    [ web3Wallet.connect, colorMode ],
  );

  return (
    <Box
      w="420px"
      maxW="full"
      border="1px solid"
      borderColor={{ _light: 'gray.200', _dark: 'whiteAlpha.100' }}
      borderRadius="md"
      overflow="hidden"
      mx="auto"
    >
      <LiFiWidget config={ config } integrator="blockscout"/>
    </Box>
  );
};

export default Swap;
