import { useRouter } from 'next/router';

import findNetwork from 'lib/networks/findNetwork';

export default function useNetwork() {
  const router = useRouter();
  const selectedNetwork = findNetwork({
    network_type: typeof router.query.network_type === 'string' ? router.query.network_type : '',
    network_sub_type: typeof router.query.network_type === 'string' ? router.query.network_type : undefined,
  });
  return selectedNetwork;
}
