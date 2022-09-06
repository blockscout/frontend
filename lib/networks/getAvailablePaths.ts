import NETWORKS from './availableNetworks';

export default function getAvailablePaths() {
  return NETWORKS.map(({ type, subType }) => ({ params: { network_type: type, network_sub_type: subType } }));
}
