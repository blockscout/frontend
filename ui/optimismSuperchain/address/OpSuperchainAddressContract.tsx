import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';

import useApiQuery from 'lib/api/useApiQuery';
import { MultichainProvider } from 'lib/contexts/multichain';
import useRoutedChainSelect from 'lib/multichain/useRoutedChainSelect';
import { ADDRESS_INFO } from 'stubs/address';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import useContractTabs from 'ui/address/contract/useContractTabs';
import ChainSelect from 'ui/shared/multichain/ChainSelect';

import getContractChainIds from './getContractChainIds';

const LEFT_SLOT_PROPS = {
  mr: 6,
};
const QUERY_PRESERVED_PARAMS = [ 'tab', 'hash' ];

interface Props {
  data: multichain.GetAddressResponse | undefined;
  addressHash: string;
  isLoading: boolean;
}

const OpSuperchainAddressContract = ({ addressHash, data, isLoading }: Props) => {

  const chainIds = React.useMemo(() => getContractChainIds(data), [ data ]);
  const chainSelect = useRoutedChainSelect({ persistedParams: QUERY_PRESERVED_PARAMS, isLoading, chainIds });

  const localAddressQuery = useApiQuery('general:address', {
    pathParams: { hash: addressHash },
    queryOptions: {
      enabled: Boolean(addressHash) && !isLoading,
      placeholderData: ADDRESS_INFO,
    },
    chainSlug: chainSelect.value?.[0],
  });

  const contractTabs = useContractTabs({
    addressData: localAddressQuery.data,
    isEnabled: !localAddressQuery.isPlaceholderData,
    hasMudTab: false,
    chainSlug: chainSelect.value?.[0],
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
    <MultichainProvider chainSlug={ chainSelect.value?.[0] }>
      <RoutedTabs
        tabs={ contractTabs.tabs }
        variant="secondary"
        size="sm"
        isLoading={ contractTabs.isLoading }
        leftSlot={ leftSlot }
        leftSlotProps={ LEFT_SLOT_PROPS }
      />
    </MultichainProvider>
  );
};

export default React.memo(OpSuperchainAddressContract);
