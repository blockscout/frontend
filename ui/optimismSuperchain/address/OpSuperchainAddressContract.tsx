import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';

import useApiQuery from 'lib/api/useApiQuery';
import { MultichainProvider, useMultichainContext } from 'lib/contexts/multichain';
import useRoutedChainSelect from 'lib/multichain/useRoutedChainSelect';
import { ADDRESS_INFO } from 'stubs/address';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import useContractTabs from 'ui/address/contract/useContractTabs';
import ChainSelect from 'ui/optimismSuperchain/components/ChainSelect';

import getContractChainIds from './getContractChainIds';

const LEFT_SLOT_PROPS = {
  mr: 6,
};
const QUERY_PRESERVED_PARAMS = [ 'tab', 'hash' ];

interface ContainerProps {
  addressHash: string;
  isLoading: boolean;
  data: multichain.GetAddressResponse | undefined;
}

const OpSuperchainAddressContractContainer = ({ addressHash, isLoading, data }: ContainerProps) => {
  const chainIds = React.useMemo(() => getContractChainIds(data), [ data ]);
  const chainSelect = useRoutedChainSelect({ persistedParams: QUERY_PRESERVED_PARAMS, isLoading, chainIds });

  return (
    <MultichainProvider chainId={ chainSelect.value?.[0] }>
      <OpSuperchainAddressContractContent
        addressHash={ addressHash }
        isLoading={ isLoading }
        chainSelect={ chainSelect }
        chainIds={ chainIds }
      />
    </MultichainProvider>
  );
};

interface ContentProps {
  addressHash: string;
  isLoading: boolean;
  chainSelect: ReturnType<typeof useRoutedChainSelect>;
  chainIds: Array<string>;
}

const OpSuperchainAddressContractContent = ({ addressHash, isLoading, chainSelect, chainIds }: ContentProps) => {

  const chain = useMultichainContext()?.chain;

  const localAddressQuery = useApiQuery('general:address', {
    pathParams: { hash: addressHash },
    queryOptions: {
      enabled: Boolean(addressHash) && !isLoading,
      placeholderData: ADDRESS_INFO,
    },
    chain,
  });

  const contractTabs = useContractTabs({
    addressData: localAddressQuery.data,
    isEnabled: !localAddressQuery.isPlaceholderData,
    hasMudTab: false,
    chain,
  });

  const leftSlot = (
    <ChainSelect
      value={ chainSelect.value }
      onValueChange={ chainSelect.onValueChange }
      loading={ isLoading }
      chainIds={ chainIds }
    />
  );

  return (
    <RoutedTabs
      tabs={ contractTabs.tabs }
      variant="secondary"
      size="sm"
      isLoading={ contractTabs.isLoading }
      leftSlot={ leftSlot }
      leftSlotProps={ LEFT_SLOT_PROPS }
    />
  );
};

export default React.memo(OpSuperchainAddressContractContainer);
