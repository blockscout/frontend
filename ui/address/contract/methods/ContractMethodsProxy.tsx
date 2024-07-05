import { Box } from '@chakra-ui/react';
import React from 'react';

import type { MethodType } from './types';
import type { AddressImplementation } from 'types/api/addressParams';

import useApiQuery from 'lib/api/useApiQuery';

import ContractConnectWallet from './ContractConnectWallet';
import ContractImplementationAddress from './ContractImplementationAddress';
import ContractMethods from './ContractMethods';
import { isReadMethod, isWriteMethod } from './utils';

interface Props {
  type: MethodType;
  implementations: Array<AddressImplementation>;
  isLoading?: boolean;
}

const ContractMethodsProxy = ({ type, implementations, isLoading: isInitialLoading }: Props) => {

  const [ selectedItem, setSelectedItem ] = React.useState(implementations[0]);

  const contractQuery = useApiQuery('contract', {
    pathParams: { hash: selectedItem.address },
    queryOptions: {
      enabled: Boolean(selectedItem.address),
      refetchOnMount: false,
    },
  });

  const handleItemSelect = React.useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextOption = implementations.find(({ address }) => address === event.target.value);
    if (nextOption) {
      setSelectedItem(nextOption);
    }
  }, [ implementations ]);

  const abi = contractQuery.data?.abi?.filter(type === 'read' ? isReadMethod : isWriteMethod) || [];

  return (
    <Box>
      <ContractConnectWallet isLoading={ isInitialLoading }/>
      <ContractImplementationAddress
        implementations={ implementations }
        selectedItem={ selectedItem }
        onItemSelect={ handleItemSelect }
        isLoading={ isInitialLoading }
      />
      <ContractMethods
        key={ selectedItem.address }
        abi={ abi }
        isLoading={ isInitialLoading || contractQuery.isPending }
        isError={ contractQuery.isError }
        type={ type }
      />
    </Box>
  );
};

export default React.memo(ContractMethodsProxy);
