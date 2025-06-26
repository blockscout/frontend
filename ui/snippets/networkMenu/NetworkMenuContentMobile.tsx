import { Box, VStack, Flex, createListCollection } from '@chakra-ui/react';
import { capitalize } from 'es-toolkit';
import React from 'react';

import type { NetworkGroup, FeaturedNetwork } from 'types/networks';

import type { SelectOption } from 'toolkit/chakra/select';
import { Select } from 'toolkit/chakra/select';
import { Skeleton } from 'toolkit/chakra/skeleton';

import NetworkMenuLink from './NetworkMenuLink';
interface Props {
  tabs: Array<NetworkGroup>;
  items?: Array<FeaturedNetwork>;
}

const NetworkMenuContentMobile = ({ items, tabs }: Props) => {
  const [ defaultTab ] = tabs ?? [ ];
  const selectedNetwork = items?.find(({ url }) => url === window.location.href) ?? items?.[0];
  const [ selectedTab, setSelectedTab ] = React.useState<NetworkGroup>(defaultTab);

  React.useEffect(() => {
    if (items) {
      setSelectedTab(tabs.find((tab) => selectedNetwork?.group === tab) ?? defaultTab);
    }
  }, [ defaultTab, items, selectedNetwork?.group, tabs ]);

  const handleSelectChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setSelectedTab(value[0] as NetworkGroup);
  }, []);

  const selectCollection = React.useMemo(() => {
    return createListCollection<SelectOption>({
      items: tabs.map((tab) => ({ label: capitalize(tab), value: tab })),
    });
  }, [ tabs ]);

  const content = !items || items.length === 0 ? (
    <Flex mt={ 6 } flexDir="column" rowGap={ 2 }>
      <Flex mx={ 3 } my={ 2 } alignItems="center">
        <Skeleton loading h="30px" w="30px" borderRadius="full"/>
        <Skeleton loading h="20px" w="60px" ml={ 3 }/>
      </Flex>
      <Flex mx={ 3 } my={ 2 } alignItems="center">
        <Skeleton loading h="30px" w="30px" borderRadius="full"/>
        <Skeleton loading h="20px" w="120px" ml={ 3 }/>
      </Flex>
      <Flex mx={ 3 } my={ 2 } alignItems="center">
        <Skeleton loading h="30px" w="30px" borderRadius="full"/>
        <Skeleton loading h="20px" w="80px" ml={ 3 }/>
      </Flex>
    </Flex>
  ) : (
    <>
      { tabs.length > 1 && (
        <Select
          value={ [ selectedTab ] }
          onValueChange={ handleSelectChange }
          collection={ selectCollection }
          placeholder="Select network type"
          mb={ 3 }
          contentProps={{ zIndex: 'modal' }}
        />
      ) }
      { selectedTab ? <h6 className="network-title">"{ selectedTab }" Chains</h6> : null }
      <VStack as="ul" gap={ 2 } alignItems="stretch" className="network-menu">
        { items
          .filter(({ group }) => group === selectedTab)
          .map((network) => (
            <NetworkMenuLink
              key={ network.title }
              { ...network }
              isMobile
            />
          ))
        }
      </VStack>
    </>
  );

  return (
    <Box mt={ 6 }>
      { content }
    </Box>
  );
};

export default React.memo(NetworkMenuContentMobile);
