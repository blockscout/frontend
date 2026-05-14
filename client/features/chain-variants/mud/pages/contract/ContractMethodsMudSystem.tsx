// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { SmartContractMudSystemItem } from 'client/features/chain-variants/mud/types/api';

import useApiQuery from 'client/api/hooks/useApiQuery';

import type { Item } from 'client/slices/contract/pages/details/code/ContractSourceAddressSelector';
import ContractSourceAddressSelector from 'client/slices/contract/pages/details/code/ContractSourceAddressSelector';
import ContractAbi from 'client/slices/contract/pages/details/methods/ContractAbi';
import ContractMethodsAlerts from 'client/slices/contract/pages/details/methods/ContractMethodsAlerts';
import ContractMethodsContainer from 'client/slices/contract/pages/details/methods/ContractMethodsContainer';
import ContractMethodsFilters from 'client/slices/contract/pages/details/methods/ContractMethodsFilters';
import useMethodsFilters from 'client/slices/contract/pages/details/methods/useMethodsFilters';
import { formatAbi } from 'client/slices/contract/pages/details/methods/utils';

import getQueryParamString from 'client/shared/router/get-query-param-string';

interface Props {
  items: Array<SmartContractMudSystemItem>;
}

const ContractMethodsMudSystem = ({ items }: Props) => {

  const router = useRouter();

  const addressHash = getQueryParamString(router.query.hash);
  const sourceAddress = getQueryParamString(router.query.source_address);
  const tab = getQueryParamString(router.query.tab);

  const [ selectedItem, setSelectedItem ] = React.useState(items.find((item) => item.address_hash === sourceAddress) || items[0]);

  const systemInfoQuery = useApiQuery('general:mud_system_info', {
    pathParams: { hash: addressHash, system_address: selectedItem.address_hash },
    queryOptions: {
      enabled: Boolean(selectedItem?.address_hash),
      refetchOnMount: false,
    },
  });

  const handleItemSelect = React.useCallback((item: Item) => {
    setSelectedItem(item as SmartContractMudSystemItem);
  }, []);

  const abi = React.useMemo(() => formatAbi(systemInfoQuery.data?.abi || []), [ systemInfoQuery.data?.abi ]);
  const filters = useMethodsFilters({ abi });

  return (
    <Flex flexDir="column" rowGap={ 6 }>
      <ContractMethodsAlerts isLoading={ systemInfoQuery.isPending }/>
      <div>
        <ContractSourceAddressSelector
          items={ items }
          selectedItem={ selectedItem }
          onItemSelect={ handleItemSelect }
          label="System address"
          mb={ 3 }
        />
        <ContractMethodsFilters
          defaultMethodType={ filters.methodType }
          defaultSearchTerm={ filters.searchTerm }
          onChange={ filters.onChange }
        />
      </div>
      <ContractMethodsContainer
        key={ selectedItem.address_hash }
        isLoading={ systemInfoQuery.isPending }
        isEmpty={ abi.length === 0 }
        type={ filters.methodType }
        isError={ systemInfoQuery.isError }
      >
        <ContractAbi
          abi={ abi }
          tab={ tab }
          addressHash={ addressHash }
          visibleItems={ filters.visibleItems }
          sourceAddress={ selectedItem.address_hash }
        />
      </ContractMethodsContainer>
    </Flex>
  );
};

export default React.memo(ContractMethodsMudSystem);
