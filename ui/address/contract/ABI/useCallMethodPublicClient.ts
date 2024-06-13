import React from 'react';
import { usePublicClient } from 'wagmi';

import type { SmartContractMethod } from '../types';
import type { FormSubmitResult, MethodCallStrategy } from './types';

import config from 'configs/app';
import useAccount from 'lib/web3/useAccount';

interface Params {
  item: SmartContractMethod;
  args: Array<unknown>;
  addressHash: string;
  strategy: Exclude<MethodCallStrategy, 'write'>;
}

export default function useCallMethodPublicClient(): (params: Params) => Promise<FormSubmitResult> {
  const publicClient = usePublicClient({ chainId: Number(config.chain.id) });
  const { address } = useAccount();

  return React.useCallback(async({ args, item, addressHash, strategy }) => {
    if (!('name' in item)) {
      throw new Error('Unknown contract method');
    }

    if (!publicClient) {
      throw new Error('Public Client is not defined');
    }

    const params = {
      abi: [ item ],
      functionName: item.name,
      args: args,
      address: addressHash as `0x${ string }`,
      account: address,
    };

    const result = strategy === 'read' ? await publicClient.readContract(params) : await publicClient.simulateContract(params);
    return {
      source: 'public_client' as const,
      result: {
        is_error: false,
        result: {
          names: [],
          output: [ {
            type: 'string',
            value: String(result),
          } ],
        },
      },
    };

  }, [ address, publicClient ]);
}
