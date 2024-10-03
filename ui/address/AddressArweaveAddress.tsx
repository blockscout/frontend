import React, { useEffect, useState } from 'react';
import { Skeleton, Text, Box } from '@chakra-ui/react';

const AddressArweaveAddress = ({ addressHash }: any) => {
  const [arweaveAddress, setArweaveAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getLambdaState = async () => {
    const response = await fetch('/api/ark');
    return response.json();
  }
  
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
      if (addressHash) {
        try {
          setIsLoading(true);
          const state = await getLambdaState();
          console.log('state', state);
          console.log('addressHash', addressHash);
          const result = searchArksByKey(state, addressHash);
          setArweaveAddress(result ? result.arweaveLinkings : null);
        } catch (error) {
          console.error('Error fetching Arweave address:', error);
          setArweaveAddress(null);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchArweaveAddress();
  }, [addressHash]);

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