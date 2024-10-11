import { useEffect, useState } from 'react';

import { useLambdaState } from './useLambdaState';

interface Props {
  addressHash: string;
}

const useArweaveAddress = ({ addressHash }: Props) => {
  const { data, isLoading } = useLambdaState(addressHash);
  const [ arweaveAddress, setArweaveAddress ] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchArweaveAddress = async() => {
      if (addressHash && data) {
        const result = searchArksByKey(data, addressHash);
        setArweaveAddress(result ? result.arweaveLinkings : null);
      }
    };

    fetchArweaveAddress();
  }, [ addressHash, data ]);

  return { arweaveAddress, isLoading };
};

export default useArweaveAddress;
