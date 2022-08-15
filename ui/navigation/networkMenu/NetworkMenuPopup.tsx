import { PopoverContent, PopoverBody, Text, Tabs, TabList, TabPanels, TabPanel, Tab, VStack } from '@chakra-ui/react';
import React from 'react';

import type { NetworkLink } from './types';

import arbitrumIcon from 'icons/networks/arbitrum.svg';
import artisIcon from 'icons/networks/artis.svg';
import ethereumClassicIcon from 'icons/networks/ethereum-classic.svg';
import ethereumIcon from 'icons/networks/ethereum.svg';
import gnosisIcon from 'icons/networks/gnosis.svg';
import poaSokolIcon from 'icons/networks/poa-sokol.svg';
import rskIcon from 'icons/networks/rsk.svg';
import useBasePath from 'lib/hooks/useBasePath';

import NetworkMenuLink from './NetworkMenuLink';

type PopupTab = 'mainnets' | 'testnets' | 'other';

const TABS: Array<PopupTab> = [ 'mainnets', 'testnets', 'other' ];

const NetworkMenuPopup = () => {
  const basePath = useBasePath();

  const LINKS: Record<PopupTab, Array<NetworkLink>> = {
    mainnets: [
      { name: 'Gnosis Chain', pathname: '/xdai/mainnet', icon: gnosisIcon, isNewUi: true },
      { name: 'Optimism on Gnosis Chain', pathname: '/xdai/optimism', icon: gnosisIcon },
      { name: 'Arbitrum on xDai', pathname: '/xdai/aox', icon: arbitrumIcon },
      { name: 'Ethereum', pathname: '/eth/mainnet', icon: ethereumIcon },
      { name: 'Ethereum Classic', pathname: '/etc/mainnet', icon: ethereumClassicIcon },
      { name: 'POA', pathname: '/poa/core' },
      { name: 'RSK', pathname: '/rsk/mainnet', icon: rskIcon },
    ],
    testnets: [
      { name: 'Gnosis Chain Testnet', pathname: '/xdai/testnet', icon: arbitrumIcon },
      { name: 'POA Sokol', pathname: '/poa/sokol', icon: poaSokolIcon },
    ],
    other: [
      { name: 'ARTIS Σ1', pathname: '/artis/sigma1', icon: artisIcon },
      { name: 'LUKSO L14', pathname: '/lukso/l14' },
    ],
  };

  return (
    <PopoverContent w="382px">
      <PopoverBody>
        <Text as="h4" fontSize="18px" lineHeight="30px" fontWeight="500">Networks</Text>
        <Tabs variant="soft-rounded" mt={ 4 } isLazy>
          <TabList>
            { TABS.map((tab) => <Tab key={ tab } textTransform="capitalize">{ tab }</Tab>) }
          </TabList>
          <TabPanels>
            { TABS.map((tab) => (
              <TabPanel key={ tab } p={ 0 }>
                <VStack as="ul" spacing={ 2 } alignItems="stretch" mt={ 4 }>
                  { LINKS[tab].map((link) => <NetworkMenuLink key={ link.name } { ...link } isActive={ basePath === link.pathname }/>) }
                </VStack>
              </TabPanel>
            )) }
          </TabPanels>
        </Tabs>
      </PopoverBody>
    </PopoverContent>
  );
};

export default NetworkMenuPopup;
