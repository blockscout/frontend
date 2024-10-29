import { useRouter } from 'next/router';
import React from 'react';

import type { AddressImplementation } from 'types/api/addressParams';

import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';

import ContractSourceAddressSelector from '../ContractSourceAddressSelector';
import ContractAbi from './ContractAbi';
import ContractConnectWallet from './ContractConnectWallet';
import ContractMethodsContainer from './ContractMethodsContainer';
import ContractMethodsFilter from './ContractMethodsFilter';
import useMethodsFilters from './useMethodsFilters';
import { enrichWithMethodId, isMethod } from './utils';

interface Props {
  implementations: Array<AddressImplementation>;
  isLoading?: boolean;
}

const ContractMethodsProxy = ({ implementations, isLoading: isInitialLoading }: Props) => {
  const router = useRouter();
  const sourceAddress = getQueryParamString(router.query.source_address);
  const tab = getQueryParamString(router.query.tab);
  const addressHash = getQueryParamString(router.query.hash);

  const [ selectedItem, setSelectedItem ] = React.useState(implementations.find((item) => item.address === sourceAddress) || implementations[0]);

  const contractQuery = useApiQuery('contract', {
    pathParams: { hash: selectedItem.address },
    queryOptions: {
      enabled: Boolean(selectedItem.address),
      refetchOnMount: false,
    },
  });

  const abi = React.useMemo(() => {
    return contractQuery.data?.abi?.filter(isMethod).map(enrichWithMethodId) || [];
  }, [ contractQuery.data?.abi ]);

  const filters = useMethodsFilters({ abi });

  return (
    <>
      <ContractMethodsFilter defaultValue={ filters.methodType } onChange={ filters.onChange }/>
      <ContractConnectWallet isLoading={ isInitialLoading }/>
      <ContractSourceAddressSelector
        items={ implementations }
        selectedItem={ selectedItem }
        onItemSelect={ setSelectedItem }
        isLoading={ isInitialLoading }
        label="Implementation address"
        mb={ 6 }
      />
      <ContractMethodsContainer
        key={ selectedItem.address }
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
          sourceAddress={ selectedItem.address }
        />
      </ContractMethodsContainer>
    </>
  );
};

export default React.memo(ContractMethodsProxy);
