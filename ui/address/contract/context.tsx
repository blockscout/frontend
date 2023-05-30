import { useQueryClient } from '@tanstack/react-query';
import type { Abi } from 'abitype';
import React from 'react';
import type { WalletClient } from 'wagmi';
import { useWalletClient } from 'wagmi';
import type { GetContractResult } from 'wagmi/actions';
import { getContract } from 'wagmi/actions';

import type { Address } from 'types/api/address';

import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';

type ProviderProps = {
  addressHash?: string;
  children: React.ReactNode;
}

type TContractContext = {
  contract: GetContractResult<Abi, WalletClient> | undefined;
  proxy: GetContractResult<Abi, WalletClient> | undefined;
  custom: GetContractResult<Abi, WalletClient> | undefined;
};

const ContractContext = React.createContext<TContractContext>({
  contract: undefined,
  proxy: undefined,
  custom: undefined,
});

export function ContractContextProvider({ addressHash, children }: ProviderProps) {
  const { data: walletClient } = useWalletClient();
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

  const { data: customInfo } = useApiQuery('contract_methods_write', {
    pathParams: { hash: addressHash },
    queryParams: { is_custom_abi: 'true' },
    queryOptions: {
      enabled: Boolean(addressInfo?.has_custom_methods_write),
      refetchOnMount: false,
    },
  });

  const contract = addressHash && contractInfo?.abi ? getContract({
    address: addressHash as `0x${ string }`,
    abi: contractInfo?.abi ?? undefined,
    walletClient: walletClient ?? undefined,
  }) : undefined;

  const proxy = addressInfo?.implementation_address && proxyInfo?.abi ? getContract({
    address: addressInfo?.implementation_address as `0x${ string }`,
    abi: proxyInfo?.abi,
    walletClient: walletClient ?? undefined,
  }) : undefined;

  const custom = addressHash && customInfo ? getContract({
    address: addressHash as `0x${ string }`,
    abi: customInfo,
    walletClient: walletClient ?? undefined,
  }) : undefined;

  const value = React.useMemo(() => ({
    contract,
    proxy,
    custom,
  // todo_tom fix this
  } as TContractContext), [ contract, proxy, custom ]);

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
