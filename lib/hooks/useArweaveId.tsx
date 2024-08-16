import { useQuery } from '@tanstack/react-query';

interface ArweaveIdProps {
  arweaveId: string;
}

interface BlockProps {
  block: number | undefined | null;
}

export function useArweaveId({ block }: BlockProps) {
  const fetchArweaveId = async() => {
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

    if (response.ok && response.status === 200) {
      const data = (await response.json()) as ArweaveIdProps;
      return data.arweaveId;
    }
  };

  const { data, error, isLoading } = useQuery({
    queryKey: [ 'getArweaveId' ],
    queryFn: () => fetchArweaveId(),
    enabled: !block,
  });

  return { data, error, isLoading };
}
