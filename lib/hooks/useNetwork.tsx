import { useRouter } from 'next/router';

import NETWORKS from 'lib/networks/availableNetworks';

export default function useNetwork() {
  const router = useRouter();
  const selectedNetwork = NETWORKS.find((network) => router.query.network_type === network.type && router.query.network_sub_type === network.subType);
  return selectedNetwork;
}
