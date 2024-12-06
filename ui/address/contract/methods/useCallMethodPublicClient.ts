import React from 'react';
import { getAddress } from 'viem';
import { usePublicClient } from 'wagmi';

import type { FormSubmitResult, MethodCallStrategy, SmartContractMethod } from './types';

import config from 'configs/app';
import useAccount from 'lib/web3/useAccount';

import { getNativeCoinValue } from './utils';

interface Params {
  item: SmartContractMethod;
  args: Array<unknown>;
  addressHash: string;
  strategy: Exclude<MethodCallStrategy, 'write'>;
}

export default function useCallMethodPublicClient(): (params: Params) => Promise<FormSubmitResult> {
  const publicClient = usePublicClient({ chainId: Number(config.chain.id) });
  const { address: account } = useAccount();

  return React.useCallback(async({ args, item, addressHash, strategy }) => {
    if (!('name' in item)) {
      throw new Error('Unknown contract method');
    }

    if (!publicClient) {
      throw new Error('Public Client is not defined');
    }

    const address = getAddress(addressHash);
    // for write payable methods we add additional input for native coin value
    // so in simulate mode we need to strip it off
    const _args = args.slice(0, item.inputs.length);
    const value = getNativeCoinValue(args[item.inputs.length]);

    const params = {
      abi: [ item ],
      functionName: item.name,
      args: _args,
      address,
      account,
      value,
    };

    const result = strategy === 'read' ? await publicClient.readContract(params) : await publicClient.simulateContract(params);
    return {
      source: 'public_client' as const,
      data: strategy === 'read' ? result : result.result,
    };

  }, [ account, publicClient ]);
}
