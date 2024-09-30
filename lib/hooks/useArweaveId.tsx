import { useQuery } from '@tanstack/react-query';

interface ArweaveIdProps {
  arweaveId: string;
}

interface ExexFallbackProps {
  block_hash: string;
  arweave_hash: string;
  block_number: number;
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
      } else {

        const exexFallback = await fetch(
          'https://exex-backfill-api.vercel.app/api/blockId',
          {
            method: 'POST',
            body: JSON.stringify({
              blockId: block,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        const fallbackData = (await exexFallback.json()) as ExexFallbackProps;

        if (fallbackData.arweave_hash) {
          return fallbackData.arweave_hash;
        }
      }
    },
    enabled: Boolean(block),
  });

  return { data, error, isLoading };
}
