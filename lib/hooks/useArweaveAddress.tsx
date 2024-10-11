import { useEffect, useState } from 'react';

import { useLambdaState } from './useLambdaState';

interface Props {
  addressHash: string;
}

const useArweaveAddress = ({ addressHash }: Props) => {
  const { data, isLoading } = useLambdaState(addressHash);
  const [ arweaveAddress, setArweaveAddress ] = useState<string | null>(null);
  const [ ANS, setANS ] = useState<string | null>(null);

  useEffect(() => {
    const fetchArweaveAddress = async() => {
      if (addressHash && data) {
        setArweaveAddress(data.arweave_address);
        setANS(data.ans);
      }
    };

    fetchArweaveAddress();
  }, [ addressHash, data ]);

  return { arweaveAddress, ANS, isLoading };
};

export default useArweaveAddress;
