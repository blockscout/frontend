import { useQuery } from '@tanstack/react-query';

export function useLambdaState(addressHash: string) {
  const { data, error, isLoading } = useQuery({
    queryKey: [ 'lambda-state', addressHash ],
    queryFn: async() => {
      if (!addressHash) {
        return null;
      }

      const response = await fetch(`https://ark-lambda-api.vercel.app/api/ark-lambda/eth-info?hash=${ addressHash.toLowerCase() }`, {
        // headers: {
        //   'Cache-Control': 'no-cache',
        // },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json() as { ark: { arweave_address: string; ans: string; call_txid: string } };
      return data.ark;
    },
  });

  return { data, error, isLoading };
}
