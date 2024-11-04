import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { SmartContractMudSystemItem } from 'types/api/contract';

import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';

import type { Item } from '../ContractSourceAddressSelector';
import ContractSourceAddressSelector from '../ContractSourceAddressSelector';
import ContractAbi from './ContractAbi';
import ContractConnectWallet from './ContractConnectWallet';
import ContractMethodsContainer from './ContractMethodsContainer';
import ContractMethodsFilters from './ContractMethodsFilters';
import useMethodsFilters from './useMethodsFilters';
import { enrichWithMethodId, isMethod } from './utils';

interface Props {
  items: Array<SmartContractMudSystemItem>;
}

const ContractMethodsMudSystem = ({ items }: Props) => {

  const router = useRouter();

  const addressHash = getQueryParamString(router.query.hash);
  const sourceAddress = getQueryParamString(router.query.source_address);
  const tab = getQueryParamString(router.query.tab);

  const [ selectedItem, setSelectedItem ] = React.useState(items.find((item) => item.address === sourceAddress) || items[0]);

  const systemInfoQuery = useApiQuery('contract_mud_system_info', {
    pathParams: { hash: addressHash, system_address: selectedItem.address },
    queryOptions: {
      enabled: Boolean(selectedItem?.address),
      refetchOnMount: false,
    },
  });

  const handleItemSelect = React.useCallback((item: Item) => {
    setSelectedItem(item as SmartContractMudSystemItem);
  }, []);

  const abi = React.useMemo(() => {
    return systemInfoQuery.data?.abi?.filter(isMethod).map(enrichWithMethodId) || [];
  }, [ systemInfoQuery.data?.abi ]);

  const filters = useMethodsFilters({ abi });

  return (
    <Flex flexDir="column" rowGap={ 6 }>
      <ContractConnectWallet/>
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
        key={ selectedItem.address }
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
          sourceAddress={ selectedItem.address }
        />
      </ContractMethodsContainer>
    </Flex>
  );
};

export default React.memo(ContractMethodsMudSystem);
