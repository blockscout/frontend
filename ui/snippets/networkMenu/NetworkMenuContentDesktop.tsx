import { VStack, Flex, Box } from '@chakra-ui/react';
import React from 'react';

import type { FeaturedNetwork, NetworkGroup } from 'types/networks';

import { PopoverBody, PopoverContent } from 'toolkit/chakra/popover';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'toolkit/chakra/tabs';

import NetworkMenuLink from './NetworkMenuLink';

interface Props {
  tabs: Array<NetworkGroup>;
  items?: Array<FeaturedNetwork>;
}

const NetworkMenuPopup = ({ items, tabs }: Props) => {
  const selectedNetwork = items?.find(({ isActive }) => isActive);
  const defaultTab = tabs.find((tab) => selectedNetwork?.group === tab);

  const [ value, setValue ] = React.useState<NetworkGroup>(defaultTab ?? 'Mainnets');

  const handleTabChange = React.useCallback(({ value }: { value: string }) => {
    setValue(value as NetworkGroup);
  }, []);

  const content = !items || items.length === 0 ? (
    <>
      <Flex alignItems="center">
        <Flex h="32px" w="105px" bgColor={{ base: 'blackAlpha.50', _dark: 'whiteAlpha.50' }} borderRadius="base" px={ 4 } py={ 2 }>
          <Skeleton loading h="16px" w="100%"/>
        </Flex>
        <Skeleton loading h="16px" w="68px" mx={ 4 }/>
        <Skeleton loading h="16px" w="45px" mx={ 4 }/>
      </Flex>
      <Flex mt={ 3 } flexDir="column" rowGap={ 2 }>
        <Flex mx={ 3 } my={ 2 } alignItems="center">
          <Skeleton loading h="30px" w="30px" borderRadius="full"/>
          <Skeleton loading h="16px" w="120px" ml={ 3 }/>
        </Flex>
        <Flex mx={ 3 } my={ 2 } alignItems="center">
          <Skeleton loading h="30px" w="30px" borderRadius="full"/>
          <Skeleton loading h="16px" w="180px" ml={ 3 }/>
        </Flex>
        <Flex mx={ 3 } my={ 2 } alignItems="center">
          <Skeleton loading h="30px" w="30px" borderRadius="full"/>
          <Skeleton loading h="16px" w="150px" ml={ 3 }/>
        </Flex>
      </Flex>
    </>
  ) : (
    <TabsRoot
      variant="secondary"
      size="sm"
      lazyMount
      value={ value }
      onValueChange={ handleTabChange }
    >
      { tabs.length > 1 && (
        <TabsList columnGap={ 2 } mb={ 4 }>
          { tabs.map((tab) => (
            <TabsTrigger
              key={ tab }
              textTransform="capitalize"
              value={ tab }
            >
              { tab }
            </TabsTrigger>
          )) }
        </TabsList>
      ) }
      <Box>
        { tabs.map((tab) => (
          <TabsContent key={ tab } value={ tab } p={ 0 }>
            <VStack as="ul" gap={ 1 } alignItems="stretch" maxH="516px" overflowY="scroll">
              { items
                .filter((network) => network.group === tab)
                .map((network) => (
                  <NetworkMenuLink
                    key={ network.title }
                    { ...network }
                  />
                )) }
            </VStack>
          </TabsContent>
        )) }
      </Box>
    </TabsRoot>
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
