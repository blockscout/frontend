import { PopoverContent, PopoverBody, Text, Tabs, TabList, TabPanels, TabPanel, Tab, VStack } from '@chakra-ui/react';
import React from 'react';

import type { NetworkGroup } from 'types/networks';

import useNetwork from 'lib/hooks/useNetwork';
import NETWORKS from 'lib/networks/availableNetworks';
import useNetworkNavigationItems from 'lib/networks/useNetworkNavigationItems';

import NetworkMenuLink from './NetworkMenuLink';

const TABS: Array<NetworkGroup> = [ 'mainnets', 'testnets', 'other' ];
const availableTabs = TABS.filter((tab) => NETWORKS.some(({ group }) => group === tab));

const NetworkMenuPopup = () => {
  const selectedNetwork = useNetwork();
  const items = useNetworkNavigationItems();
  const selectedTab = availableTabs.findIndex((tab) => selectedNetwork?.group === tab);

  return (
    <PopoverContent w="382px">
      <PopoverBody>
        <Text as="h4" fontSize="18px" lineHeight="30px" fontWeight="500">Networks</Text>
        <Tabs variant="soft-rounded" mt={ 4 } isLazy defaultIndex={ selectedTab !== -1 ? selectedTab : undefined }>
          { availableTabs.length > 1 && (
            <TabList>
              { availableTabs.map((tab) => <Tab key={ tab } textTransform="capitalize">{ tab }</Tab>) }
            </TabList>
          ) }
          <TabPanels mt={ 8 }>
            { availableTabs.map((tab) => (
              <TabPanel key={ tab } p={ 0 }>
                <VStack as="ul" spacing={ 2 } alignItems="stretch" mt={ 4 }>
                  { items
                    .filter((network) => network.group === tab)
                    .map((network) => (
                      <NetworkMenuLink
                        key={ network.title }
                        { ...network }
                      />
                    )) }
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
