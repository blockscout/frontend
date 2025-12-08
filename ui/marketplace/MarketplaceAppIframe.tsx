import { Center, chakra } from '@chakra-ui/react';
import { DappscoutIframeProvider, useDappscoutIframe } from 'dappscout-iframe';
import React, { useCallback, useEffect, useState, useMemo } from 'react';

import config from 'configs/app';
import essentialDappsChainsConfig from 'configs/essential-dapps-chains';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';

import useMarketplaceWallet from '../marketplace/useMarketplaceWallet';

const IFRAME_SANDBOX_ATTRIBUTE = 'allow-forms allow-orientation-lock ' +
'allow-pointer-lock allow-popups-to-escape-sandbox ' +
'allow-same-origin allow-scripts ' +
'allow-top-navigation-by-user-activation allow-popups';

const IFRAME_ALLOW_ATTRIBUTE = 'clipboard-read; clipboard-write;';

type ContentProps = {
  appUrl?: string;
  address?: string;
  message?: Record<string, unknown>;
  isAdaptiveHeight?: boolean;
  className?: string;
};

const Content = chakra(({ appUrl, address, message, isAdaptiveHeight, className }: ContentProps) => {
  const { iframeRef, isReady } = useDappscoutIframe();

  const [ iframeKey, setIframeKey ] = useState(0);
  const [ isFrameLoading, setIsFrameLoading ] = useState(true);
  const [ iframeHeight, setIframeHeight ] = useState(0);

  useEffect(() => {
    setIframeKey((key) => key + 1);
  }, [ address ]);

  const handleIframeLoad = useCallback(() => {
    setIsFrameLoading(false);
  }, []);

  useEffect(() => {
    if (!isFrameLoading && message && appUrl) {
      iframeRef?.current?.contentWindow?.postMessage(message, appUrl);
    }
  }, [ isFrameLoading, appUrl, iframeRef, message ]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== appUrl) {
        return;
      }
      if (event.data?.type === 'window-height' && isAdaptiveHeight) {
        setIframeHeight(Number(event.data.height));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [ appUrl, isAdaptiveHeight ]);

  return (
    <Center
      flexGrow={ 1 }
      minH={ isAdaptiveHeight ? `${ iframeHeight }px` : undefined }
      minW="100%"
      className={ className }
    >
      { (isFrameLoading) && (
        <ContentLoader/>
      ) }

      { isReady && (
        <chakra.iframe
          key={ iframeKey }
          allow={ IFRAME_ALLOW_ATTRIBUTE }
          ref={ iframeRef }
          sandbox={ IFRAME_SANDBOX_ATTRIBUTE }
          h="100%"
          w="100%"
          display={ isFrameLoading ? 'none' : 'block' }
          src={ appUrl }
          title="Marketplace dapp"
          onLoad={ handleIframeLoad }
          background="transparent"
          allowTransparency={ true }
        />
      ) }
    </Center>
  );
});

type Props = {
  appId: string;
  appUrl?: string;
  message?: Record<string, unknown>;
  isFixedChainId?: boolean;
  isAdaptiveHeight?: boolean;
  className?: string;
};

const MarketplaceAppIframe = ({
  appId, appUrl, message, isFixedChainId, isAdaptiveHeight, className,
}: Props) => {
  const {
    address,
    chainId: connectedChainId,
    sendTransaction,
    signMessage,
    signTypedData,
    switchChain,
  } = useMarketplaceWallet(appId, isFixedChainId);

  const [ chainId, rpcUrl ] = useMemo(() => {
    let data: [ number?, string? ] = [ Number(config.chain.id), config.chain.rpcUrls[0] ];

    if (!isFixedChainId) {
      const chainConfig = essentialDappsChainsConfig()?.chains.find(
        (chain) => chain.id === String(connectedChainId),
      );
      if (chainConfig?.app_config?.chain?.rpcUrls[0]) {
        data = [ connectedChainId, chainConfig.app_config.chain.rpcUrls[0] ];
      }
    }

    return data;
  }, [ isFixedChainId, connectedChainId ]);

  return (
    <DappscoutIframeProvider
      address={ address }
      appUrl={ appUrl }
      chainId={ chainId }
      rpcUrl={ rpcUrl }
      sendTransaction={ sendTransaction }
      signMessage={ signMessage }
      signTypedData={ signTypedData }
      switchChain={ switchChain }
    >
      <Content
        appUrl={ appUrl }
        address={ address }
        message={ message }
        isAdaptiveHeight={ isAdaptiveHeight }
        className={ className }
      />
    </DappscoutIframeProvider>
  );
};

export default chakra(MarketplaceAppIframe);
