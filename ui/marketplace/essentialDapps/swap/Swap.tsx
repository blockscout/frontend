import { Box, useToken } from '@chakra-ui/react';
import type { RouteExecutionUpdate, WidgetConfig } from '@lifi/widget';
import { LiFiWidget, useWidgetEvents, WidgetEvent } from '@lifi/widget';
import { useEffect, useMemo, useRef } from 'react';

import config from 'configs/app';
import essentialDappsChainsConfig from 'configs/essential-dapps-chains';
import useRewardsActivity from 'lib/hooks/useRewardsActivity';
import * as mixpanel from 'lib/mixpanel/index';
import useWeb3Wallet from 'lib/web3/useWallet';
import { useColorMode } from 'toolkit/chakra/color-mode';
import { BODY_TYPEFACE } from 'toolkit/theme/foundations/typography';

const feature = config.features.marketplace;
const dappConfig = feature.isEnabled ? feature.essentialDapps?.swap : undefined;

const defaultChainId = Number(
  dappConfig?.chains.includes(config.chain.id as string) ?
    config.chain.id :
    dappConfig?.chains[0],
);

function getUrls(isRpc = false) {
  return Object.fromEntries(dappConfig?.chains.map((chainId) => {
    const chainConfig = essentialDappsChainsConfig()?.chains.find((chain) => chain.config.chain.id === chainId);
    const url = isRpc ? `${ chainConfig?.config.apis.general?.endpoint }/api/eth-rpc` : chainConfig?.config.app.baseUrl;
    return [ Number(chainId), [ url ] ];
  }) || []);
}

const Widget = () => {
  const web3Wallet = useWeb3Wallet({ source: 'Essential dapps' });
  const { colorMode } = useColorMode();
  const [ color ] = useToken('colors', 'blue.600');

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
            primary: { main: color },
            secondary: { main: color },
          },
        },
        hiddenUI: [ 'appearance' ],
        fromChain: defaultChainId,
        fromToken: '0x0000000000000000000000000000000000000000',
        chains: {
          allow: dappConfig?.chains.map((chainId) => Number(chainId)),
        },
        sdkConfig: {
          rpcUrls: getUrls(true),
        },
        explorerUrls: getUrls(),
        walletConfig: {
          onConnect: web3Wallet.connect,
        },
      } as Partial<WidgetConfig>),
    [ web3Wallet.connect, colorMode, color ],
  );

  return (
    <Box
      w="fit-content"
      maxW="full"
      border="1px solid"
      borderColor="border.divider"
      borderRadius="md"
      overflow="hidden"
      mx="auto"
    >
      <LiFiWidget config={ config } integrator={ dappConfig?.integrator || '' }/>
    </Box>
  );
};

const Swap = () => {
  const { trackTransaction, trackTransactionConfirm } = useRewardsActivity();
  const widgetEvents = useWidgetEvents();
  const eventParams = useRef<{
    activityToken?: string;
    routeId?: string;
    from?: string;
    chainId?: string;
  }>({});

  useEffect(() => {
    const onRouteExecutionUpdated = async(update: RouteExecutionUpdate) => {
      try {
        if (eventParams.current.routeId !== update.route.id) {
          const { chainId, from, to } = update.route.steps.at(-1)?.transactionRequest ?? {};
          if (chainId && from && to) {
            const response = await trackTransaction(from, to, String(chainId));
            eventParams.current = {
              activityToken: response?.token,
              routeId: update.route.id,
              from,
              chainId: String(chainId),
            };
          }
        } else if ([ 'SWAP', 'CROSS_CHAIN' ].includes(update.process.type) && update.process.txHash) {
          mixpanel.logEvent(mixpanel.EventTypes.WALLET_ACTION, {
            Action: 'Send Transaction',
            Address: eventParams.current.from,
            AppId: 'swap',
            Source: 'Essential dapps',
            ChainId: eventParams.current.chainId,
          });
          if (eventParams.current.activityToken) {
            await trackTransactionConfirm(update.process.txHash, eventParams.current.activityToken);
          }
          eventParams.current = {};
        }
      } catch {}
    };

    widgetEvents.on(WidgetEvent.RouteExecutionUpdated, onRouteExecutionUpdated);

    return () => widgetEvents.all.clear();
  }, [ widgetEvents, trackTransaction, trackTransactionConfirm ]);

  return <Widget/>;
};

export default Swap;
