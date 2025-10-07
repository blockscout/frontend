import { Box } from '@chakra-ui/react';
import type { WidgetConfig } from '@lifi/widget';
import { LiFiWidget } from '@lifi/widget';
import { useMemo } from 'react';

import config from 'configs/app';
import essentialDappsChains from 'configs/essentialDappsChains';
import useWeb3Wallet from 'lib/web3/useWallet';
import { useColorMode } from 'toolkit/chakra/color-mode';
import colors from 'toolkit/theme/foundations/colors';
import { BODY_TYPEFACE } from 'toolkit/theme/foundations/typography';

const feature = config.features.marketplace;
const dappConfig = feature.isEnabled ? feature.essentialDapps?.swap : undefined;

const defaultChainId = Number(
  dappConfig?.chains.includes(config.chain.id as string) ?
    config.chain.id :
    dappConfig?.chains[0],
);

const Swap = () => {
  const web3Wallet = useWeb3Wallet({ source: 'Essential dapps' });
  const { colorMode } = useColorMode();

  const config = useMemo(
    () =>
      ({
        fee: Number(dappConfig?.fee),
        variant: 'compact',
        subvariant: 'default',
        appearance: colorMode,
        theme: {
          typography: { fontFamily: BODY_TYPEFACE },
          shape: {
            borderRadius: 12,
            borderRadiusSecondary: 8,
          },
          palette: {
            primary: { main: colors.blue[600].value },
            secondary: { main: colors.blue[600].value },
          },
        },
        fromChain: defaultChainId,
        fromToken: '0x0000000000000000000000000000000000000000',
        chains: {
          allow: dappConfig?.chains.map((chainId) => Number(chainId)),
        },
        sdkConfig: {
          rpcUrls: Object.fromEntries(dappConfig?.chains.map((chainId) => ([
            Number(chainId),
            [ `${ essentialDappsChains[chainId] }/api/eth-rpc` ],
          ])) || []),
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
      <LiFiWidget config={ config } integrator={ dappConfig?.integrator || '' }/>
    </Box>
  );
};

export default Swap;
