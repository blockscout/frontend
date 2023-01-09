import type { ExternalProvider } from '@ethersproject/providers';
import type { Contract } from 'ethers';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';

type ProviderProps = {
  children: React.ReactNode;
}

type TContractContext = Contract;

const ContractContext = React.createContext<TContractContext | null>(null);

export function ContractContextProvider({ children }: ProviderProps) {
  const [ contract, setContract ] = React.useState<TContractContext | null>(null);
  const router = useRouter();
  const addressHash = router.query.id?.toString();

  const { data } = useApiQuery('contract', {
    pathParams: { id: addressHash },
    queryOptions: {
      enabled: Boolean(addressHash),
      refetchOnMount: false,
    },
  });

  React.useEffect(() => {
    if (!addressHash || !data?.abi) {
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum as unknown as ExternalProvider);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(addressHash, data.abi, provider);
    const contractWithSigner = contract.connect(signer);
    setContract(contractWithSigner);

  }, [ data, addressHash ]);

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
