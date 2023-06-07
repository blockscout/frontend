import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { Address } from 'types/api/address';
import type { SmartContract } from 'types/api/contract';

import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';

type ProviderProps = {
  addressHash?: string;
  children: React.ReactNode;
}

type TContractContext = {
  contractInfo: SmartContract | undefined;
  proxyInfo: SmartContract | undefined;
  customInfo: SmartContract | undefined;
};

const ContractContext = React.createContext<TContractContext>({
  proxyInfo: undefined,
  contractInfo: undefined,
  customInfo: undefined,
});

export function ContractContextProvider({ addressHash, children }: ProviderProps) {
  const queryClient = useQueryClient();

  const { data: contractInfo } = useApiQuery('contract', {
    pathParams: { hash: addressHash },
    queryOptions: {
      enabled: Boolean(addressHash),
      refetchOnMount: false,
    },
  });

  const addressInfo = queryClient.getQueryData<Address>(getResourceKey('address', {
    pathParams: { hash: addressHash },
  }));

  const { data: proxyInfo } = useApiQuery('contract', {
    pathParams: { hash: addressInfo?.implementation_address || '' },
    queryOptions: {
      enabled: Boolean(addressInfo?.implementation_address),
      refetchOnMount: false,
    },
  });

  // todo_tom check custom abi case
  const { data: customInfo } = useApiQuery('contract_methods_write', {
    pathParams: { hash: addressHash },
    queryParams: { is_custom_abi: 'true' },
    queryOptions: {
      enabled: Boolean(addressInfo?.has_custom_methods_write),
      refetchOnMount: false,
    },
  });

  const value = React.useMemo(() => ({
    proxyInfo,
    contractInfo,
    customInfo,
  } as TContractContext), [ proxyInfo, contractInfo, customInfo ]);

  return (
    <ContractContext.Provider value={ value }>
      { children }
    </ContractContext.Provider>
  );
}

export function useContractContext() {
  const context = React.useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContractContext must be used within a ContractContextProvider');
  }
  return context;
}
