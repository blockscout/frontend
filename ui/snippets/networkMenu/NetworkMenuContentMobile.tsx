import { Box, Select, VStack } from '@chakra-ui/react';
import capitalize from 'lodash/capitalize';
import React from 'react';

import type { NetworkGroup } from 'types/networks';

import useNetwork from 'lib/hooks/useNetwork';
import useNetworkNavigationItems from 'lib/networks/useNetworkNavigationItems';

import NetworkMenuLink from './NetworkMenuLink';

const TABS: Array<NetworkGroup> = [ 'mainnets', 'testnets', 'other' ];

const NetworkMenuContentMobile = () => {
  const selectedNetwork = useNetwork();
  const [ selectedTab, setSelectedTab ] = React.useState<NetworkGroup>(TABS.find((tab) => selectedNetwork?.group === tab) || 'mainnets');
  const items = useNetworkNavigationItems();

  const handleSelectChange = React.useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTab(event.target.value as NetworkGroup);
  }, []);

  return (
    <Box mt={ 6 }>
      <Select size="sm" borderRadius="base" value={ selectedTab } onChange={ handleSelectChange } focusBorderColor="none">
        { TABS.map((tab) => <option key={ tab } value={ tab }>{ capitalize(tab) }</option>) }
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
    </Box>
  );
};

export default NetworkMenuContentMobile;
