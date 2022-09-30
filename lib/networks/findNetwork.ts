// todo_tom delete this
import availableNetworks from 'lib/networks/availableNetworks';

interface Params {
  network_type: string;
  network_sub_type?: string;
}

export default function findNetwork(params: Params) {
  return availableNetworks.find((network) =>
    network.type === params.network_type &&
    network.subType ? network.subType === params.network_sub_type : network.type === params.network_type,
  );
}
