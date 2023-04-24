import { Box, Select, VStack } from '@chakra-ui/react';
import capitalize from 'lodash/capitalize';
import React from 'react';

import type { NetworkGroup } from 'types/networks';

import featuredNetworks from 'lib/networks/featuredNetworks';

import NetworkMenuLink from './NetworkMenuLink';

const TABS: Array<NetworkGroup> = [ 'mainnets', 'testnets', 'other' ];
const availableTabs = TABS.filter((tab) => featuredNetworks.some(({ group }) => group === tab));

const NetworkMenuContentMobile = () => {
  const selectedNetwork = featuredNetworks.find(({ isActive }) => isActive);
  const [ selectedTab, setSelectedTab ] = React.useState<NetworkGroup>(availableTabs.find((tab) => selectedNetwork?.group === tab) || 'mainnets');

  const handleSelectChange = React.useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTab(event.target.value as NetworkGroup);
  }, []);

  return (
    <Box mt={ 6 }>
      <Select size="xs" borderRadius="base" value={ selectedTab } onChange={ handleSelectChange } focusBorderColor="none">
        { availableTabs.map((tab) => <option key={ tab } value={ tab }>{ capitalize(tab) }</option>) }
      </Select>
      <VStack as="ul" spacing={ 2 } alignItems="stretch" mt={ 6 }>
        { featuredNetworks
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
    </Box>
  );
};

export default NetworkMenuContentMobile;
