import { Box } from '@chakra-ui/react';
import React from 'react';

import type { MethodType } from './types';
import type { AddressImplementation } from 'types/api/addressParams';

import useApiQuery from 'lib/api/useApiQuery';

import ContractConnectWallet from './ContractConnectWallet';
import ContractMethods from './ContractMethods';
import ContractSourceAddressSelector from './ContractSourceAddressSelector';
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

  const abi = contractQuery.data?.abi?.filter(type === 'read' ? isReadMethod : isWriteMethod) || [];

  return (
    <Box>
      <ContractConnectWallet isLoading={ isInitialLoading }/>
      <ContractSourceAddressSelector
        items={ implementations }
        selectedItem={ selectedItem }
        onItemSelect={ setSelectedItem }
        isLoading={ isInitialLoading }
        label="Implementation address"
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
