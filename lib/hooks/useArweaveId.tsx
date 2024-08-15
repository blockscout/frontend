import { useQuery } from '@tanstack/react-query';

import config from 'configs/app';

interface ArweaveIdProps {
  arweaveId: string;
}

interface Props {
  block: number | undefined | null;
}

export default function useArweaveId({ block }: Props) {
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
    const response = await fetch(config.googleCloud.nextAPI, {
      method: 'GET',
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
