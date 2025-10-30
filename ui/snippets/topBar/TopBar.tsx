import { Flex, Separator, Box, HStack } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import useProvider from 'lib/web3/useProvider';
import { CONTENT_MAX_WIDTH } from 'ui/shared/layout/utils';
import NetworkAddToWallet from 'ui/shared/NetworkAddToWallet';

import DeFiDropdown from './DeFiDropdown';
import NetworkMenu from './NetworkMenu';
import Settings from './settings/Settings';
import TopBarStats from './TopBarStats';

const TopBar = () => {
  const web3 = useProvider();
  const isMobile = useIsMobile();

  const hasAddChainButton = Boolean(web3.provider && web3.wallet && config.chain.rpcUrls.length && config.features.web3Wallet.isEnabled && !isMobile);
  const hasDeFiDropdown = Boolean(config.features.deFiDropdown.isEnabled);

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
        { !config.features.opSuperchain.isEnabled ? <TopBarStats/> : <div/> }
        <HStack alignItems="center" separator={ <Separator mx={{ base: 2, lg: 3 }} height={ 4 } orientation="vertical"/> }>
          { (hasAddChainButton || hasDeFiDropdown) && (
            <HStack>
              { hasAddChainButton && <NetworkAddToWallet/> }
              { hasDeFiDropdown && <DeFiDropdown/> }
            </HStack>
          ) }
          <Settings/>
          { Boolean(config.UI.featuredNetworks.items) && <NetworkMenu/> }
        </HStack>
      </Flex>
    </Box>
  );
};

export default React.memo(TopBar);
