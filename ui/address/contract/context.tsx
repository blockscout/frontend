import type { Contract } from 'ethers';
import { useRouter } from 'next/router';
import React from 'react';
import { useContract, useProvider, useSigner } from 'wagmi';

import useApiQuery from 'lib/api/useApiQuery';

type ProviderProps = {
  children: React.ReactNode;
}

type TContractContext = Contract;

const ContractContext = React.createContext<TContractContext | null>(null);

export function ContractContextProvider({ children }: ProviderProps) {
  const router = useRouter();
  const provider = useProvider();
  const { data: signer } = useSigner();

  const addressHash = router.query.id?.toString();
  const { data: contractInfo } = useApiQuery('contract', {
    pathParams: { id: addressHash },
    queryOptions: {
      enabled: Boolean(addressHash),
      refetchOnMount: false,
    },
  });

  const contract = useContract({
    address: addressHash,
    abi: contractInfo?.abi || undefined,
    signerOrProvider: signer || provider,
  });

  return (
    <ContractContext.Provider value={ contract }>
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
