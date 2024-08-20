import { useQuery } from '@tanstack/react-query';

interface ArweaveIdProps {
  arweaveId: string;
}

interface BlockProps {
  block: number | undefined | null;
}

export function useArweaveId({ block }: BlockProps) {
  const { data, error, isLoading } = useQuery({
    queryKey: [ 'get arweave id', block ],
    queryFn: async() => {
      const response = await fetch(
        'https://arweaveid-api.vercel.app/api/arweave-id',
        {
          method: 'POST',
          body: JSON.stringify({
            blockNumber: block,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const data = (await response.json()) as ArweaveIdProps;

      if (data.arweaveId) {
        return data.arweaveId;
      }
      return 'Arweave Id Not Found';
    },
    enabled: Boolean(block),
  });

  return { data, error, isLoading };
}
