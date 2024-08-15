import { useQuery } from '@tanstack/react-query';

interface ArweaveIdProps {
  arweaveId: string;
}

// interface Props {
//   block: number | undefined | null;
// }

export function useArweaveId() {
  // const fetchArweaveId = async() => {
  //   const response = await fetch(config.googleCloud.nextAPI, {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       blockNumber: block,
  //     }),
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });

  //   if (response.ok && response.status === 200) {
  //     const data = (await response.json()) as ArweaveIdProps;
  //     return data.arweaveId;
  //   }
  // };

  const fetchArweaveId = async() => {
    const response = await fetch(
      'https://arweaveid-api.vercel.app/api/arweave-id',
    );

    if (response.ok && response.status === 200) {
      const data = (await response.json()) as ArweaveIdProps;
      return data.arweaveId;
    }
  };

  const { data, error, isLoading } = useQuery({
    queryKey: [ 'getArweaveId' ],
    queryFn: () => fetchArweaveId(),
  });

  return { data, error, isLoading };
}
