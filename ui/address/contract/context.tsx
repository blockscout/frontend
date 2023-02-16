import { useQueryClient } from '@tanstack/react-query';
import type { Contract } from 'ethers';
import { useRouter } from 'next/router';
import React from 'react';
import { useContract, useProvider, useSigner } from 'wagmi';

import type { Address } from 'types/api/address';

import useApiQuery, { getResourceKey } from 'lib/api/useApiQuery';

type ProviderProps = {
  children: React.ReactNode;
}

type TContractContext = {
  contract: Contract | null;
  proxy: Contract | null;
};

const ContractContext = React.createContext<TContractContext>({
  contract: null,
  proxy: null,
});

export function ContractContextProvider({ children }: ProviderProps) {
  const router = useRouter();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const queryClient = useQueryClient();

  const addressHash = router.query.hash?.toString();
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

  const contract = useContract({
    address: addressHash,
    abi: contractInfo?.abi || undefined,
    signerOrProvider: signer || provider,
  });
  const proxy = useContract({
    address: addressInfo?.implementation_address ?? undefined,
    abi: proxyInfo?.abi ?? undefined,
    signerOrProvider: signer ?? provider,
  });

  const value = React.useMemo(() => ({
    contract,
    proxy,
  }), [ contract, proxy ]);

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
