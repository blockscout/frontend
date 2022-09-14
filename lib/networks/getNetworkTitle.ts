import findNetwork from './findNetwork';

export default function getNetworkTitle({ network_type: type, network_sub_type: subType }: {network_type?: string; network_sub_type?: string}) {
  const currentNetwork = findNetwork({ network_type: type || '', network_sub_type: subType });
  if (currentNetwork) {
    return currentNetwork.name + (currentNetwork.shortName ? ` (${ currentNetwork.shortName })` : '') + ' Explorer';
  }
  return '';
}
