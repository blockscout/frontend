import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { MultichainProvider } from 'lib/contexts/multichain';
import useRoutedChainSelect from 'lib/multichain/useRoutedChainSelect';
import { ADDRESS_INFO } from 'stubs/address';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import useContractTabs from 'ui/address/contract/useContractTabs';
import ChainSelect from 'ui/shared/multichain/ChainSelect';

const LEFT_SLOT_PROPS = {
  mr: 6,
};
const QUERY_PRESERVED_PARAMS = [ 'tab', 'hash' ];

interface Props {
  addressHash: string;
}

const OpSuperchainAddressContract = ({ addressHash }: Props) => {

  const chainSelect = useRoutedChainSelect({ persistedParams: QUERY_PRESERVED_PARAMS });

  const addressQuery = useApiQuery('general:address', {
    pathParams: { hash: addressHash },
    queryOptions: {
      enabled: Boolean(addressHash),
      placeholderData: ADDRESS_INFO,
    },
    chainSlug: chainSelect.value?.[0],
  });

  const contractTabs = useContractTabs({
    addressData: addressQuery.data,
    isEnabled: !addressQuery.isPlaceholderData,
    hasMudTab: false,
    chainSlug: chainSelect.value?.[0],
  });

  const leftSlot = (
    <ChainSelect
      value={ chainSelect.value }
      onValueChange={ chainSelect.onValueChange }
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
