import { PopoverContent, PopoverBody, Text, Tabs, TabList, TabPanels, TabPanel, Tab, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { NetworkGroup } from 'types/networks';

import { NETWORKS } from 'lib/networks';

import NetworkMenuLink from './NetworkMenuLink';

const TABS: Array<NetworkGroup> = [ 'mainnets', 'testnets', 'other' ];

const NetworkMenuPopup = () => {
  const router = useRouter();
  const routeName = router.pathname.replace('/[network_type]/[network_sub_type]', '');

  return (
    <PopoverContent w="382px">
      <PopoverBody>
        <Text as="h4" fontSize="18px" lineHeight="30px" fontWeight="500">Networks</Text>
        <Tabs variant="soft-rounded" mt={ 4 } isLazy>
          <TabList>
            { TABS.map((tab) => <Tab key={ tab } textTransform="capitalize">{ tab }</Tab>) }
          </TabList>
          <TabPanels mt={ 8 }>
            { TABS.map((tab) => (
              <TabPanel key={ tab } p={ 0 }>
                <VStack as="ul" spacing={ 2 } alignItems="stretch" mt={ 4 }>
                  { NETWORKS
                    .filter((network) => network.group === tab)
                    .map((network) => (
                      <NetworkMenuLink
                        key={ network.name }
                        { ...network }
                        isActive={ router.query.network_type === network.type && router.query.network_sub_type === network.subType }
                        routeName={ routeName }
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
