import type * as multichain from '@blockscout/multichain-aggregator-types';

export default function getContractName(data: { chain_infos: Record<string, multichain.GetAddressResponse_ChainInfo> }) {
  const names = Object.values(data.chain_infos ?? {}).map((chainInfo) => chainInfo.contract_name);

  if (names.some((name) => !name)) {
    return;
  }

  const uniqueNames = [ ...new Set(names) ];

  if (uniqueNames.length === 1) {
    return uniqueNames[0];
  }
}
