import { Box, VStack, Flex } from '@chakra-ui/react';
import { capitalize } from 'es-toolkit';
import React from 'react';

import type { NetworkGroup, FeaturedNetwork } from 'types/networks';

import { NativeSelectField, NativeSelectRoot } from 'toolkit/chakra/native-select';
import { Skeleton } from 'toolkit/chakra/skeleton';

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
    setSelectedTab(event.currentTarget.value as NetworkGroup);
  }, []);

  const content = !items || items.length === 0 ? (
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
  ) : (
    <>
      { tabs.length > 1 && (
        <NativeSelectRoot size="sm" borderRadius="base" mb={ 3 }>
          <NativeSelectField value={ selectedTab } onChange={ handleSelectChange }>
            { tabs.map((tab) => <option key={ tab } value={ tab }>{ capitalize(tab) }</option>) }
          </NativeSelectField>
        </NativeSelectRoot>
      ) }
      <VStack as="ul" gap={ 2 } alignItems="stretch">
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
