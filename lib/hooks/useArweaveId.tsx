import { useQuery } from '@tanstack/react-query';

interface ArweaveIdProps {
  arweaveId: string;
}

interface Props {
  block: number | undefined | null;
}

export default function useArweaveId({ block }: Props) {
  const fetchArweaveId = async() => {
    const response = await fetch('/api/arweave-id', {
      method: 'POST',
      body: JSON.stringify({
        blockNumber: block,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok && response.status === 200) {
      const data = (await response.json()) as ArweaveIdProps;
      return data.arweaveId;
    }
  };

  const { data, error, isLoading } = useQuery({
    queryKey: [ 'getArweaveId', block ],
    queryFn: () => fetchArweaveId(),
    enabled: !block,
  });

  return { data, error, isLoading };
}
