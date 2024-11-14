import { viem as facetViem } from '@0xfacet/sdk';
import React, { useMemo } from 'react';
import { encodeFunctionData, getAddress, type Abi } from 'viem';
import { useAccount, useWalletClient } from 'wagmi';

import type { FormSubmitResult, SmartContractMethod } from './types';

import { getNativeCoinValue } from './utils';

interface Params {
  item: SmartContractMethod;
  args: Array<unknown>;
  addressHash: string;
}

export default function useCallMethodWalletClient(): (params: Params) => Promise<FormSubmitResult> {
  const { data: walletClientWithoutFacet } = useWalletClient();
  const { isConnected, address: from } = useAccount();
  const walletClient = useMemo(
    () => walletClientWithoutFacet?.extend(facetViem.walletL1FacetActions),
    [ walletClientWithoutFacet ],
  );

  return React.useCallback(async({ args, item, addressHash }) => {
    if (!isConnected || !from) {
      throw new Error('Wallet is not connected');
    }

    if (!walletClient) {
      throw new Error('Wallet Client is not defined');
    }

    const address = getAddress(addressHash);

    let value = BigInt(0);

    let data: `0x${ string }` = '0x';

    if (item.type === 'receive' || item.type === 'fallback') {
      value = getNativeCoinValue(args[0]);
    } else {
      const _args = args.slice(0, item.inputs.length);
      value = getNativeCoinValue(args[item.inputs.length]);

      const methodName = item.name;

      if (!methodName) {
        throw new Error('Method name is not defined');
      }

      const encodedFunctionData = encodeFunctionData({
        abi: [ item ] as Abi,
        functionName: methodName,
        args: _args,
      });

      if (encodedFunctionData) {
        data = encodedFunctionData;
      }
    }

    const { facetTransactionHash } = await walletClient.sendFacetTransaction({ to: address, value, data });

    return { source: 'wallet_client', data: { hash: facetTransactionHash } };
  }, [ from, isConnected, walletClient ]);
}
