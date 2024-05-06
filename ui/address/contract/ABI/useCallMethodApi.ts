import React from 'react';

import type { FormSubmitResult } from './types';
import type { SmartContractQueryMethod } from 'types/api/contract';

import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import useAccount from 'lib/web3/useAccount';

interface Params {
  methodId: string;
  args: Array<unknown>;
  isProxy: boolean;
  isCustomAbi: boolean;
  addressHash: string;
}

export default function useCallMethodApi(): (params: Params) => Promise<FormSubmitResult> {
  const apiFetch = useApiFetch();
  const { address } = useAccount();

  return React.useCallback(async({ addressHash, isCustomAbi, isProxy, args, methodId }) => {
    try {
      const response = await apiFetch<'contract_method_query', SmartContractQueryMethod>('contract_method_query', {
        pathParams: { hash: addressHash },
        queryParams: {
          is_custom_abi: isCustomAbi ? 'true' : 'false',
        },
        fetchParams: {
          method: 'POST',
          body: {
            args,
            method_id: methodId,
            contract_type: isProxy ? 'proxy' : 'regular',
            from: address,
          },
        },
      });

      return {
        source: 'api',
        result: response,
      };
    } catch (error) {
      return {
        source: 'api',
        result: error as (Error | ResourceError),
      };
    }
  }, [ address, apiFetch ]);
}
