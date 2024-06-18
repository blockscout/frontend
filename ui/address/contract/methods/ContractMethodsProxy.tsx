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
  addressHash: string | undefined;
  implementations: Array<AddressImplementation>;
  isLoading?: boolean;
}

const ContractMethodsProxy = ({ type, addressHash, implementations, isLoading: isInitialLoading }: Props) => {

  const [ selectedImplementation ] = React.useState(implementations[0].address);

  const contractQuery = useApiQuery('contract', {
    pathParams: { hash: selectedImplementation },
    queryOptions: {
      enabled: Boolean(selectedImplementation),
      refetchOnMount: false,
    },
  });

  const abi = contractQuery.data?.abi?.filter(type === 'read' ? isReadMethod : isWriteMethod) || [];

  return (
    <Box>
      <ContractConnectWallet isLoading={ isInitialLoading }/>
      <ContractImplementationAddress hash={ addressHash }/>
      <ContractMethods abi={ abi } isLoading={ contractQuery.isPending } isError={ contractQuery.isError } type={ type }/>
    </Box>
  );
};

export default React.memo(ContractMethodsProxy);
