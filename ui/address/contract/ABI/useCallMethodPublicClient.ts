import React from 'react';
import type { Abi } from 'viem';
import { usePublicClient } from 'wagmi';

import type { SmartContractMethod } from '../types';
import type { FormSubmitResult } from './types';

import useAccount from 'lib/web3/useAccount';

import { isReadMethod } from '../utils';

interface Params {
  item: SmartContractMethod;
  args: Array<unknown>;
  addressHash: string;
}

export default function useCallMethodPublicClient(): (params: Params) => Promise<FormSubmitResult> {
  const publicClient = usePublicClient();
  const { address } = useAccount();

  return React.useCallback(async({ args, item, addressHash }) => {
    if (!('name' in item)) {
      throw new Error('Unknown contract method');
    }

    if (!publicClient) {
      throw new Error('Public Client is not defined');
    }

    const params = {
      abi: [ item ] as Abi,
      functionName: item.name,
      args: args,
      address: addressHash as `0x${ string }`,
      account: address,
    };

    const result = isReadMethod(item) ? await publicClient.readContract(params) : await publicClient.simulateContract(params);
    return {
      source: 'public_client' as const,
      result: {
        is_error: false,
        result: {
          names: [],
          output: [ {
            type: 'string',
            value: result as string,
          } ],
        },
      },
    };

  }, [ address, publicClient ]);
}
