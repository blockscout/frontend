// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { AddressImplementation } from 'client/slices/address/types/api';
import type { SmartContractConflictingImplementation, SmartContractProxyType } from 'client/slices/contract/types/api';

import useApiQuery from 'client/api/hooks/useApiQuery';

import getQueryParamString from 'client/shared/router/get-query-param-string';

import ContractSourceAddressSelector from '../code/ContractSourceAddressSelector';
import ContractAbi from './ContractAbi';
import ContractMethodsAlerts from './ContractMethodsAlerts';
import ContractMethodsContainer from './ContractMethodsContainer';
import ContractMethodsFilters from './ContractMethodsFilters';
import useMethodsFilters from './useMethodsFilters';
import { formatAbi } from './utils';

interface Props {
  implementations: Array<AddressImplementation>;
  isLoading?: boolean;
  proxyType?: SmartContractProxyType;
  conflictingImplementations?: Array<SmartContractConflictingImplementation>;
}

const ContractMethodsProxy = ({ implementations, isLoading: isInitialLoading, proxyType, conflictingImplementations }: Props) => {
  const router = useRouter();
  const sourceAddress = getQueryParamString(router.query.source_address);
  const tab = getQueryParamString(router.query.tab);
  const addressHash = getQueryParamString(router.query.hash);

  const [ selectedItem, setSelectedItem ] = React.useState(implementations.find((item) => item.address_hash === sourceAddress) || implementations[0]);

  const contractQuery = useApiQuery('general:contract', {
    pathParams: { hash: selectedItem.address_hash },
    queryOptions: {
      enabled: Boolean(selectedItem.address_hash),
      refetchOnMount: false,
    },
  });

  const abi = React.useMemo(() => formatAbi(contractQuery.data?.abi || []), [ contractQuery.data?.abi ]);
  const filters = useMethodsFilters({ abi });

  return (
    <Flex flexDir="column" rowGap={ 6 }>
      <ContractMethodsAlerts isLoading={ isInitialLoading } proxyType={ proxyType } conflictingImplementations={ conflictingImplementations }/>
      <div>
        <ContractSourceAddressSelector
          items={ implementations }
          selectedItem={ selectedItem }
          onItemSelect={ setSelectedItem }
          isLoading={ isInitialLoading }
          label={ proxyType === 'eip7702' ? 'Delegate address' : 'Implementation address' }
          mb={ 3 }
        />
        <ContractMethodsFilters
          defaultMethodType={ filters.methodType }
          defaultSearchTerm={ filters.searchTerm }
          onChange={ filters.onChange }
          isLoading={ isInitialLoading }
        />
      </div>
      <ContractMethodsContainer
        key={ selectedItem.address_hash }
        isLoading={ isInitialLoading || contractQuery.isPending }
        isEmpty={ abi.length === 0 }
        type={ filters.methodType }
        isError={ contractQuery.isError }
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

export default React.memo(ContractMethodsProxy);
