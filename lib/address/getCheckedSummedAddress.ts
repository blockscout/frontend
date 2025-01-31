import { getAddress } from 'viem';

import config from 'configs/app';

export default function getCheckedSummedAddress(address: string): string {
  try {
    return getAddress(
      address,
      // We need to pass chainId to getAddress to make it work correctly for some chains, e.g. Rootstock
      config.chain.id ? Number(config.chain.id) : undefined,
    );
  } catch (error) {
    return address;
  }
}
