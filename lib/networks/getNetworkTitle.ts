import NETWORKS from './availableNetworks';

export default function getNetworkTitle({ network_type: type, network_sub_type: subType }: {network_type: string; network_sub_type: string}) {
  const currentNetwork = NETWORKS.find(n => n.type === type && n.subType === subType);
  if (currentNetwork) {
    return currentNetwork.name + (currentNetwork.shortName ? ` (${ currentNetwork.shortName })` : '') + ' Explorer';
  }
  return '';
}
