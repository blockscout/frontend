import { Box, Select, VStack, Skeleton, Flex } from '@chakra-ui/react';
import capitalize from 'lodash/capitalize';
import React from 'react';

import type { NetworkGroup, FeaturedNetwork } from 'types/networks';

import NetworkMenuLink from './NetworkMenuLink';

interface Props {
  tabs: Array<NetworkGroup>;
  items?: Array<FeaturedNetwork>;
}

const NetworkMenuContentMobile = ({ items, tabs }: Props) => {
  const selectedNetwork = items?.find(({ isActive }) => isActive);
  const [ selectedTab, setSelectedTab ] = React.useState<NetworkGroup>('Mainnets');

  React.useEffect(() => {
    if (items) {
      setSelectedTab(tabs.find((tab) => selectedNetwork?.group === tab) || 'Mainnets');
    }
  }, [ items, selectedNetwork?.group, tabs ]);

  const handleSelectChange = React.useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTab(event.target.value as NetworkGroup);
  }, []);

  const content = !items || items.length === 0 ? (
    <>
      <Skeleton h="32px" w="100%"/>
      <Flex mt={ 6 } flexDir="column" rowGap={ 2 }>
        <Flex mx={ 3 } my={ 2 } alignItems="center">
          <Skeleton h="30px" w="30px" borderRadius="full"/>
          <Skeleton h="20px" w="60px" ml={ 3 }/>
        </Flex>
        <Flex mx={ 3 } my={ 2 } alignItems="center">
          <Skeleton h="30px" w="30px" borderRadius="full"/>
          <Skeleton h="20px" w="120px" ml={ 3 }/>
        </Flex>
        <Flex mx={ 3 } my={ 2 } alignItems="center">
          <Skeleton h="30px" w="30px" borderRadius="full"/>
          <Skeleton h="20px" w="80px" ml={ 3 }/>
        </Flex>
      </Flex>
    </>
  ) : (
    <>
      <Select size="xs" borderRadius="base" value={ selectedTab } onChange={ handleSelectChange } focusBorderColor="none">
        { tabs.map((tab) => <option key={ tab } value={ tab }>{ capitalize(tab) }</option>) }
      </Select>
      <VStack as="ul" spacing={ 2 } alignItems="stretch" mt={ 6 }>
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
