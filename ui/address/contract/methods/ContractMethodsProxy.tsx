import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { MethodType } from './types';
import type { AddressImplementation } from 'types/api/addressParams';

import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';

import ContractSourceAddressSelector from '../ContractSourceAddressSelector';
import ContractConnectWallet from './ContractConnectWallet';
import ContractMethods from './ContractMethods';
import { enrichWithMethodId, isReadMethod, isWriteMethod } from './utils';

interface Props {
  type: MethodType;
  implementations: Array<AddressImplementation>;
  isLoading?: boolean;
}

const ContractMethodsProxy = ({ type, implementations, isLoading: isInitialLoading }: Props) => {
  const router = useRouter();
  const contractAddress = getQueryParamString(router.query.source_address);

  const [ selectedItem, setSelectedItem ] = React.useState(implementations.find((item) => item.address === contractAddress) || implementations[0]);

  const contractQuery = useApiQuery('contract', {
    pathParams: { hash: selectedItem.address },
    queryOptions: {
      enabled: Boolean(selectedItem.address),
      refetchOnMount: false,
    },
  });

  const abi = contractQuery.data?.abi?.filter(type === 'read' ? isReadMethod : isWriteMethod).map(enrichWithMethodId) || [];

  return (
    <Box>
      <ContractConnectWallet isLoading={ isInitialLoading }/>
      <ContractSourceAddressSelector
        items={ implementations }
        selectedItem={ selectedItem }
        onItemSelect={ setSelectedItem }
        isLoading={ isInitialLoading }
        label="Implementation address"
        mb={ 6 }
      />
      <ContractMethods
        key={ selectedItem.address }
        abi={ abi }
        isLoading={ isInitialLoading || contractQuery.isPending }
        isError={ contractQuery.isError }
        sourceAddress={ selectedItem.address }
        type={ type }
      />
    </Box>
  );
};

export default React.memo(ContractMethodsProxy);
