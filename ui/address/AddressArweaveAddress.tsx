import React, { useEffect, useState } from 'react';
import { Skeleton, Text, Box } from '@chakra-ui/react';
import { useLambdaState } from 'lib/hooks/useLambdaState';

const AddressArweaveAddress = ({ addressHash }: any) => {
  const [arweaveAddress, setArweaveAddress] = useState<string | null>(null);
  const { data, isLoading } = useLambdaState();

  const searchArksByKey = (state: any, ethereumAddress: string) => {
    if (!ethereumAddress || !state) return null;
    if (state.arks?.[ethereumAddress.toLowerCase()]) {
      return { ethereumAddress: ethereumAddress.toLowerCase(), arweaveLinkings: state.arks[ethereumAddress.toLowerCase()][0].arweave_address, callTXID: state.arks[ethereumAddress.toLowerCase()][0].call_txid };
    } else {
      return null;
    }
  }

  useEffect(() => {
    const fetchArweaveAddress = async () => {
      if (addressHash && data) {
        // @ts-ignore
        const result = searchArksByKey(data?.data, addressHash);
        setArweaveAddress(result ? result.arweaveLinkings : null);
      }
    };

    fetchArweaveAddress();
  }, [addressHash, data]);

  return (
    <Skeleton isLoaded={!isLoading}>
      {arweaveAddress ? (
        <Box>
          <Text mr={2} as="a" href={`https://viewblock.io/arweave/address/${arweaveAddress}`} target="_blank" rel="noopener noreferrer" color="blue.500" textDecoration="underline">
            {arweaveAddress}
          </Text>
        </Box>
      ) : (
        <Text>No linked Arweave address found</Text>
      )}
    </Skeleton>
  );
};

export default AddressArweaveAddress;