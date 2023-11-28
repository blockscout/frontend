import {
  AbsoluteCenter, Button, Flex, Text, Modal, ModalBody, ModalCloseButton,
  ModalContent, ModalHeader, ModalOverlay, useClipboard, useColorModeValue, Link,
  Image,
} from '@chakra-ui/react';
import * as browserUtils from '@walletconnect/browser-utils';
import type { AbstractWalletController } from '@ylide/sdk';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useYlide } from 'lib/contexts/ylide';
import { walletsMeta } from 'lib/contexts/ylide/constants';
import FilterInput from 'ui/shared/filters/FilterInput';

import { TabSwitcher } from './TabSwitcher';
import { WalletButton } from './WalletButton';
import { WalletsList } from './WalletsList';
import { WrappedQRCode } from './WrappedQRCode';

export interface SelectWalletModalProps {
  onClose?: (wallet?: AbstractWalletController) => void;
}

export function openInNewWidnow(url: string) {
  window.open(url, '_blank')?.focus();
}

const YlideLoader = () => <>loading</>;

export const SelectWalletModal = ({ onClose }: SelectWalletModalProps) => {
  const isMobile = browserUtils.isMobile();
  const isDesktop = !isMobile;

  const { initialized, wallets, walletConnectRegistry, walletConnectState } = useYlide();
  const { disconnectWalletConnect } = walletConnectState;

  const platform = isMobile ? 'mobile' : 'desktop';
  const links = browserUtils.getMobileLinkRegistry(
    browserUtils.formatMobileRegistry(walletConnectRegistry.registry, platform),
  );

  const [ activeTab, setActiveTab ] = useState<'qr' | 'desktop' | 'install'>(
    walletConnectState.initialized && walletConnectState.connection ? 'install' : 'qr',
  );
  const [ search, setSearch ] = useState('');

  const availableBrowserWallets = useMemo(
    () =>
      Object.entries(walletsMeta)
        .filter(
          ([ wallet ]) =>
            wallet !== 'walletconnect' &&
Boolean(wallets.find(ww => ww.wallet() === wallet)),
        )
        .map(([ wallet ]) => wallet),
    [ wallets ],
  );

  const walletsToInstall = useMemo(
    () =>
      Object.entries(walletsMeta)
        .filter(([ wallet ]) => !availableBrowserWallets.includes(wallet) && wallet !== 'walletconnect')
        .map(([ wallet ]) => wallet),
    [ availableBrowserWallets ],
  );

  const isWalletConnectAlreadyUsed = walletConnectState.initialized && walletConnectState.connection;

  function renderWalletConnectAlreadyUsed(walletName: string) {
    return (
      <div className="overall">
WalletConnect can be used to connect only one account.
        <br/>
        <br/>
Please, use native browser extensions to connect more wallets or disconnect current WalletConnect
connection.
        <br/>
        <br/>
        <Button
          size="sm"
          w="100%"
          h="50px"
          mb={ 4 }
          onClick={ disconnectWalletConnect }
        >
Disconnect WalletConnect
          <br/>({ walletName })
        </Button>
      </div>
    );
  }

  const onSelectWallet = useCallback(
    (w: string) => {
      onClose?.(wallets.find(it => it.wallet() === w));
    },
    [ onClose, wallets ],
  );

  const onSelectExternalWallet = useCallback(
    (w: string) => {
      openInNewWidnow(walletsMeta[w].link);
    },
    [ ],
  );

  const onSelectDesktopWallet = useCallback(
    (w: (typeof links)[0]) => {
      const href = browserUtils.formatIOSMobile(
        walletConnectState.initialized && !walletConnectState.connection ? walletConnectState.url : '',
        w,
      );
      browserUtils.saveMobileLinkInfo({
        name: w.name,
        href: href,
      });
      openInNewWidnow(href);
    },
    [ walletConnectState ],
  );

  const { hasCopied, onCopy } = useClipboard(!isWalletConnectAlreadyUsed ?
    walletConnectState.url :
    '', 1000);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [ onClose ]);

  const modalBg = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const renderQRContent = () => (
    <Flex
      alignItems="center"
      marginTop={ 1 }
      flexDirection="column"
    >
      { isWalletConnectAlreadyUsed && walletConnectState.connection ? (
        renderWalletConnectAlreadyUsed(walletConnectState.connection.walletName)
      ) : (
        <>
          <WrappedQRCode
            value={ walletConnectState.initialized && !walletConnectState.connection ? walletConnectState.url : '' }
          />
          <Text
            fontSize="12px"
            fontStyle="normal"
            lineHeight="16px"
            textAlign="center"
            mt={ 3 }
          >
            Scan QR code with
            <br/>a WalletConnect compatible wallet
          </Text>
          <Link
            href="#copy-link"
            onClick={ onCopy }
            fontSize="12px"
            fontStyle="normal"
            lineHeight="16px"
            textAlign="center"
            fontWeight="400"
            my={ 2 }
          >
            { hasCopied ? 'Copied' : 'Copy to clipboard' }
          </Link>
        </>
      ) }
    </Flex>
  );

  const searchInput = (
    <FilterInput
      w="100%"
      size="xs"
      onChange={ setSearch }
      placeholder="Search by wallet name"
      initialValue={ search }
    />
  );

  const getMobileWalletLogo = useCallback((w: (typeof links)[0]) => (
    <Image
      src={ w.logo }
      alt="Wallet Logo"
      width="32px"
      height="32px"
      borderRadius={ 0 }
    />
  ), []);
  const getMobileWalletTitle = useCallback((w: (typeof links)[0]) => w.name, []);

  const getInternalWalletLogo = useCallback((w: string) => walletsMeta[w].logo(32), []);
  const getInternalWalletTitle = useCallback((w: string) => walletsMeta[w].title, []);

  const renderMobileWalletsList = () => (
    isWalletConnectAlreadyUsed && walletConnectState.connection ? (
      renderWalletConnectAlreadyUsed(walletConnectState.connection.walletName)
    ) : (
      <WalletsList
        isLoading={ walletConnectRegistry.loading }
        wallets={ links.filter(d => d.name.toLowerCase().includes(search.toLowerCase())) }
        onSelect={ onSelectDesktopWallet }
        logo={ getMobileWalletLogo }
        title={ getMobileWalletTitle }
        searchInput={ searchInput }
      />
    )
  );

  const renderInstallWalletsList = () => (
    <WalletsList
      isLoading={ false }
      wallets={ walletsToInstall
        .filter(w =>
          walletsMeta[w] ?
            walletsMeta[w].title.toLowerCase().includes(search.toLowerCase()) :
            false,
        ) }
      onSelect={ onSelectExternalWallet }
      logo={ getInternalWalletLogo }
      title={ getInternalWalletTitle }
      searchInput={ searchInput }
    />
  );

  const renderDesktopWalletsList = () => (
    walletConnectState.initialized && walletConnectState.connection ? (
      renderWalletConnectAlreadyUsed(walletConnectState.connection.walletName)
    ) : (
      <WalletsList
        isLoading={ walletConnectRegistry.loading }
        wallets={ links
          .filter(d => d.name.toLowerCase().includes(search.toLowerCase())) }
        onSelect={ onSelectDesktopWallet }
        logo={ getMobileWalletLogo }
        title={ getMobileWalletTitle }
        searchInput={ searchInput }
      />
    )
  );

  const [ wasConnectedOnMount ] = useState(Boolean(walletConnectState.connection));

  useEffect(() => {
    const wc = wallets.find(it => it.wallet() === 'walletconnect');
    if (!wasConnectedOnMount && walletConnectState.connection && wc) {
      onClose?.(wc);
    }
  }, [ wasConnectedOnMount, walletConnectState.connection, wallets, onClose ]);

  const qrTabContent = isDesktop ? renderQRContent() : renderMobileWalletsList();

  let tabContent = qrTabContent;
  if (activeTab === 'desktop') {
    tabContent = renderDesktopWalletsList();
  } else if (activeTab === 'install') {
    tabContent = renderInstallWalletsList();
  }

  if (!initialized) {
    return (
      <Modal isOpen={ true } onClose={ handleClose }>
        <ModalOverlay/>
        <ModalContent w={ 420 }>
          <ModalHeader>Select wallet</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <YlideLoader/>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={ true } onClose={ handleClose }>
      <ModalOverlay/>
      <ModalContent w={ 420 } pb={ 1 } pt={ 5 } px={ 8 }>
        <ModalHeader>Select wallet</ModalHeader>
        <ModalCloseButton top={ 5 }/>
        <ModalBody mb={ 0 }>
          { Boolean(availableBrowserWallets.length) && (
            <div className="available-wallets">
              <Flex
                flexDir="row"
                alignItems="center"
                justifyContent="center"
                flexWrap="wrap"
                position="relative"
                padding="0"
                border="1px solid"
                borderColor={ borderColor }
                borderRadius={ 12 }
                paddingTop="4"
                pb={ 0 }
              >
                <AbsoluteCenter bg={ modalBg } px="4" top={ 0 } fontSize={ 13 } whiteSpace="nowrap">
                Available browser extensions
                </AbsoluteCenter>
                { availableBrowserWallets.map(w => (
                  <WalletButton
                    key={ w }
                    logo={ walletsMeta[w].logo(32) }
                    title={ walletsMeta[w].title }
                    wallet={ w }
                    onSelectWallet={ onSelectWallet }
                  />
                )) }
              </Flex>
            </div>
          ) }

          <TabSwitcher
            selected={ activeTab }
            onSelect={ setActiveTab }
            tabs={ isDesktop ? [
              {
                key: 'qr',
                label: 'QR code',
              },
              {
                key: 'desktop',
                label: 'Desktop',
              },
              {
                key: 'install',
                label: 'Install',
              },
            ] : [
              {
                key: 'qr',
                label: 'Mobile',
              },
            ] }
          />

          <Flex
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="stretch"
            marginTop="16px"
            minHeight={ 0 }
            position="relative"
          >
            { tabContent }
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
