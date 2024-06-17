import { PopoverContent, PopoverBody, Tabs, TabList, TabPanels, TabPanel, Tab, VStack, Skeleton, Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { FeaturedNetwork, NetworkGroup } from 'types/networks';

import NetworkMenuLink from './NetworkMenuLink';

interface Props {
  tabs: Array<NetworkGroup>;
  items?: Array<FeaturedNetwork>;
}

const NetworkMenuPopup = ({ items, tabs }: Props) => {
  const selectedNetwork = items?.find(({ isActive }) => isActive);
  const defaultTab = tabs.findIndex((tab) => selectedNetwork?.group === tab);

  const [ tabIndex, setTabIndex ] = React.useState(defaultTab > -1 ? defaultTab : 0);

  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  const handleTabChange = React.useCallback((index: number) => {
    setTabIndex(index);
  }, []);

  const content = !items || items.length === 0 ? (
    <>
      <Flex alignItems="center">
        <Flex h="32px" w="105px" bgColor={ bgColor } borderRadius="base" px={ 4 } py={ 2 }>
          <Skeleton h="16px" w="100%"/>
        </Flex>
        <Skeleton h="16px" w="68px" mx={ 4 }/>
        <Skeleton h="16px" w="45px" mx={ 4 }/>
      </Flex>
      <Flex mt={ 3 } flexDir="column" rowGap={ 2 }>
        <Flex mx={ 3 } my={ 2 } alignItems="center">
          <Skeleton h="30px" w="30px" borderRadius="full"/>
          <Skeleton h="16px" w="120px" ml={ 3 }/>
        </Flex>
        <Flex mx={ 3 } my={ 2 } alignItems="center">
          <Skeleton h="30px" w="30px" borderRadius="full"/>
          <Skeleton h="16px" w="180px" ml={ 3 }/>
        </Flex>
        <Flex mx={ 3 } my={ 2 } alignItems="center">
          <Skeleton h="30px" w="30px" borderRadius="full"/>
          <Skeleton h="16px" w="150px" ml={ 3 }/>
        </Flex>
      </Flex>
    </>
  ) : (
    <Tabs
      variant="outline"
      colorScheme="gray"
      size="sm"
      isLazy
      index={ tabIndex }
      onChange={ handleTabChange }
    >
      { tabs.length > 1 && (
        <TabList columnGap={ 2 }>
          { tabs.map((tab, index) => (
            <Tab key={ tab } textTransform="capitalize" { ...(tabIndex === index ? { 'data-selected': 'true' } : {}) }>
              { tab }
            </Tab>
          )) }
        </TabList>
      ) }
      <TabPanels mt={ 3 }>
        { tabs.map((tab) => (
          <TabPanel key={ tab } p={ 0 }>
            <VStack as="ul" spacing={ 1 } alignItems="stretch" mt={ 4 } maxH="516px" overflowY="scroll">
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
  );

  return (
    <PopoverContent w="330px">
      <PopoverBody>
        { content }
      </PopoverBody>
    </PopoverContent>
  );
};

export default React.memo(NetworkMenuPopup);
