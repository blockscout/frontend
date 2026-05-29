// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Box, HStack } from '@chakra-ui/react';
import React from 'react';

import { useAppContext } from 'src/shell/app/context';
import { CONTENT_MAX_WIDTH } from 'src/shell/layout/utils';

import CsvExportDownloads from 'src/features/csv-export/components/downloads/CsvExportDownloads';
import DeFiDropdown from 'src/features/defi-dropdown/components/DeFiDropdown';
import NetworkAddToWallet from 'src/features/web3-wallet/components/NetworkAddToWallet';
import useProvider from 'src/features/web3-wallet/hooks/useProvider';

import config from 'src/config';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import * as cookies from 'src/shared/storage/cookies';

import NetworkMenu from './chain-menu/ChainMenu';
import Settings from './settings/Settings';
import TopBarStats from './TopBarStats';

const TopBar = () => {
  const hideAddToWalletButtonCookie = cookies.get(cookies.NAMES.HIDE_ADD_TO_WALLET_BUTTON, useAppContext().cookies);
  const [ isAddChainButtonVisible, setIsAddChainButtonVisible ] = React.useState(hideAddToWalletButtonCookie !== 'topbar');

  const web3 = useProvider();
  const isMobile = useIsMobile();

  const hasAddChainButton = Boolean(
    isAddChainButtonVisible &&
    web3.data?.provider &&
    web3.data?.wallet &&
    config.chain.rpcUrls.length &&
    config.features.web3Wallet.isEnabled &&
    !config.features.multichain.isEnabled &&
    !isMobile,
  );
  const hasDeFiDropdown = Boolean(config.features.deFiDropdown.isEnabled);

  const handleAddSuccess = React.useCallback(() => {
    cookies.set(cookies.NAMES.HIDE_ADD_TO_WALLET_BUTTON, 'topbar', { expires: 3 * 365 });
    setIsAddChainButtonVisible(false);
  }, [ ]);

  return (
    // not ideal if scrollbar is visible, but better than having a horizontal scroll
    <Box bgColor={{ _light: 'theme.topbar.bg._light', _dark: 'theme.topbar.bg._dark' }} position="sticky" left={ 0 } width="100%" maxWidth="100vw">
      <Flex
        py={ 2 }
        px={{ base: 3, lg: 6 }}
        m="0 auto"
        justifyContent="space-between"
        alignItems="center"
        maxW={ `${ CONTENT_MAX_WIDTH }px` }
      >
        <HStack gap={ 0 } fontSize="xs">
          { Boolean(config.shell.topBar.chainMenu.items || config.features.multichain.isEnabled) && <NetworkMenu/> }
          { !config.features.multichain.isEnabled ? <TopBarStats/> : <div/> }
        </HStack>
        <HStack
          alignItems="center"
          gap={ 3 }
        >
          { (hasAddChainButton || hasDeFiDropdown) && (
            <HStack>
              { hasAddChainButton && <NetworkAddToWallet source="Top bar" onAddSuccess={ handleAddSuccess }/> }
              { hasDeFiDropdown && <DeFiDropdown/> }
            </HStack>
          ) }
          <HStack gap={ 0 }>
            <CsvExportDownloads/>
            <Settings/>
          </HStack>
        </HStack>
      </Flex>
    </Box>
  );
};

export default React.memo(TopBar);
