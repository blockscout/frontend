import { useEffect, useState } from 'react';

import { useLambdaState } from './useLambdaState';

interface Props {
  addressHash: string;
}

const useArweaveAddress = ({ addressHash }: Props) => {
  const { data, isLoading } = useLambdaState(addressHash);
  const [ arweaveAddress, setArweaveAddress ] = useState<string | null>(null);
  const [ ANS, setANS ] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchArksByKey = (state: any, ethereumAddress: string) => {
    if (!ethereumAddress || !state) {
      return null;
    }

    if (state?.ark) {
      return {
        ethereumAddress: ethereumAddress.toLowerCase(),
        arweaveLinkings: state.ark[0].arweave_address,
        callTXID: state.ark[0].call_txid,
      };
    } else {
      return null;
    }
  };

  async function resolveANS(arweaveAddress: string) {
    try {
      if (!arweaveAddress) return null;
      const ANS_RESOLVER_URL = 'https://ans-resolver.herokuapp.com/resolve/';
      const response = await fetch(`${ ANS_RESOLVER_URL }${ arweaveAddress }`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json() as { domain: string };
      console.log(data  )
      return data;
    } catch (e) {
      console.log((e as Error).message);
      return null;
    }
  }


  useEffect(() => {
    const fetchArweaveAddress = async() => {
      if (addressHash && data) {
        const result = searchArksByKey(data, addressHash);
        const arweaveAddress = result ? result.arweaveLinkings : null;
        setArweaveAddress(arweaveAddress);
        resolveANS(arweaveAddress).then((data) => {
          if (data?.domain) setANS(data.domain);
        });
      }
    };

    fetchArweaveAddress();
  }, [ addressHash, data ]);

  return { arweaveAddress, ANS, isLoading };
};

export default useArweaveAddress;
