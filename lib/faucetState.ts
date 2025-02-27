import { JsonRpcProvider, NonceManager, Wallet } from 'ethers';

import { getEnvValue } from 'configs/app/utils';

const provider = new JsonRpcProvider(
  getEnvValue('NEXT_PUBLIC_NETWORK_RPC_URL'),
  Number(getEnvValue('NEXT_PUBLIC_NETWORK_ID')),
  {
    staticNetwork: true,
  },
);

const _signer = new Wallet(getEnvValue('NEXT_PUBLIC_FAUCET_KEY')!, provider);
export const signer = new NonceManager(_signer);

export const requestLock = new Set<string>();
export const requestHistory = new Map<string, string>();
