// SPDX-License-Identifier: LicenseRef-Blockscout

import { Center, chakra } from '@chakra-ui/react';
import { DappscoutIframeProvider, useDappscoutIframe } from 'dappscout-iframe';
import React, { useCallback, useEffect, useState } from 'react';

import Web3Boundary from 'src/features/connect-wallet/components/Web3Boundary';

import config from 'src/config';

import { ContentLoader } from 'src/toolkit/components/loaders/ContentLoader';

import useMarketplaceWallet from '../hooks/useMarketplaceWallet';

const IFRAME_SANDBOX_ATTRIBUTE = 'allow-forms allow-orientation-lock ' +
'allow-pointer-lock allow-popups-to-escape-sandbox ' +
'allow-same-origin allow-scripts ' +
'allow-top-navigation-by-user-activation allow-popups';

const IFRAME_ALLOW_ATTRIBUTE = 'clipboard-read; clipboard-write;';

type ContentProps = {
  appUrl?: string;
  address?: string;
  message?: Record<string, unknown>;
  className?: string;
};

const Content = chakra(({ appUrl, address, message, className }: ContentProps) => {
  const { iframeRef, isReady } = useDappscoutIframe();

  const [ iframeKey, setIframeKey ] = useState(0);
  const [ isFrameLoading, setIsFrameLoading ] = useState(true);

  useEffect(() => {
    setIsFrameLoading(true);
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

  return (
    <Center
      flexGrow={ 1 }
      minW="100%"
      className={ className }
    >
      { (isFrameLoading || !appUrl) && (
        <ContentLoader/>
      ) }

      { isReady && appUrl && (
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
  className?: string;
};

const MarketplaceAppIframeContent = ({
  appId, appUrl, message, className,
}: Props) => {
  const {
    address,
    sendTransaction,
    signMessage,
    signTypedData,
    switchChain,
  } = useMarketplaceWallet(appId);

  return (
    <DappscoutIframeProvider
      address={ address }
      appUrl={ appUrl }
      chainId={ Number(config.chain.id) }
      rpcUrl={ config.chain.rpcUrls[0] }
      sendTransaction={ sendTransaction }
      signMessage={ signMessage }
      signTypedData={ signTypedData }
      switchChain={ switchChain }
    >
      <Content
        appUrl={ appUrl }
        address={ address }
        message={ message }
        className={ className }
      />
    </DappscoutIframeProvider>
  );
};

// The dapp bridge feeds wallet actions (send tx / sign / switch chain via `useMarketplaceWallet`) into the
// iframe, so the host lives in a wallet island. Marketplace pages call `ensureLoaded()` at mount, so the
// runtime is already loading by the time this renders; the fallback reuses the iframe's content loader.
const MarketplaceAppIframe = (props: Props) => (
  <Web3Boundary fallback={ null }>
    <MarketplaceAppIframeContent { ...props }/>
  </Web3Boundary>
);

export default chakra(MarketplaceAppIframe);
