import { Box } from '@chakra-ui/react';
import type { WidgetConfig } from '@lifi/widget';
import { LiFiWidget } from '@lifi/widget';
import { useMemo } from 'react';

import config from 'configs/app';
import essentialDappsChains from 'configs/essentialDappsChains';

import essentialDappsConfig from '../config';

const defaultChainId = Number(
  essentialDappsConfig.revoke.chains.includes(config.chain.id as string) ?
    config.chain.id :
    essentialDappsConfig.revoke.chains[0],
);

const Swap = () => {
  const config = useMemo(
    () =>
      ({
        fee: 0.004, // 0.4% instead of 0.075%
        variant: 'compact',
        subvariant: 'default',
        appearance: 'light',
        theme: {
          palette: {
            primary: { main: '#2B6CB0' },
            secondary: { main: '#2B6CB0' },
          },
          typography: { fontFamily: 'Inter, sans-serif' },
          container: {
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
          },
          shape: {
            borderRadius: 24,
            borderRadiusSecondary: 8,
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
          // onConnect: open,
        },
      } as Partial<WidgetConfig>),
    [],
  );

  return (
    <Box w="418px">
      <LiFiWidget config={ config } integrator="blockscout"/>
    </Box>
  );
};

export default Swap;
