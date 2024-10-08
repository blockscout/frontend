import React, { useEffect, useState } from 'react';
import { Skeleton, Text, chakra } from '@chakra-ui/react';
import { useLambdaState } from 'lib/hooks/useLambdaState';
import * as EntityBase from 'ui/shared/entities/base/components';

const Link = chakra((props: any) => {

  return (
    <EntityBase.Link
      href={ props.href }
    >
      { props.addressHash }
    </EntityBase.Link>
  );
});

const AddressArweaveAddress = ({ addressHash }: any) => {
  const [arweaveAddress, setArweaveAddress] = useState<string | null>(null);
  const { data, isLoading } = useLambdaState(addressHash);

  const searchArksByKey = (state: any, ethereumAddress: string) => {
    if (!ethereumAddress || !state) return null;
    if (state?.ark) {
      return { ethereumAddress: ethereumAddress.toLowerCase(), arweaveLinkings: state.ark[0].arweave_address, callTXID: state.ark[0].call_txid };
    } else {
      return null;
    }
  }

  useEffect(() => {
    const fetchArweaveAddress = async () => {
      if (addressHash && data) {
        // @ts-ignore
        const result = searchArksByKey(data, addressHash);
        setArweaveAddress(result ? result.arweaveLinkings : null);
      }
    };

    fetchArweaveAddress();
  }, [addressHash, data]);

  return (
    <Skeleton isLoaded={!isLoading}>
      {arweaveAddress ? (
        <Link href={`https://viewblock.io/arweave/address/${arweaveAddress}`} addressHash={arweaveAddress} />
      ) : (
        <Text>No linked Arweave address found</Text>
      )}
    </Skeleton>
  );
};

export default AddressArweaveAddress;