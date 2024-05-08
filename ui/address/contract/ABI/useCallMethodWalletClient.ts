import React from 'react';
import type { Abi } from 'viem';
import { useAccount, useWalletClient, useSwitchChain } from 'wagmi';

import type { ContractAbiItem, FormSubmitResult } from './types';

import config from 'configs/app';

import { getNativeCoinValue } from './utils';

interface Params {
  item: ContractAbiItem;
  args: Array<unknown>;
  addressHash: string;
}

export default function useCallMethodWalletClient(): (params: Params) => Promise<FormSubmitResult> {
  const { data: walletClient } = useWalletClient();
  const { isConnected, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  return React.useCallback(async({ args, item, addressHash }) => {
    if (!isConnected) {
      throw new Error('Wallet is not connected');
    }

    if (!walletClient) {
      throw new Error('Wallet Client is not defined');
    }

    if (chainId && String(chainId) !== config.chain.id) {
      await switchChainAsync?.({ chainId: Number(config.chain.id) });
    }

    if (item.type === 'receive' || item.type === 'fallback') {
      const value = getNativeCoinValue(args[0]);
      const hash = await walletClient.sendTransaction({
        to: addressHash as `0x${ string }` | undefined,
        value,
      });
      return { source: 'wallet_client', result: { hash } };
    }

    const methodName = item.name;

    if (!methodName) {
      throw new Error('Method name is not defined');
    }

    const _args = args.slice(0, item.inputs.length);
    const value = getNativeCoinValue(args[item.inputs.length]);

    const hash = await walletClient.writeContract({
      args: _args,
      // Here we provide the ABI as an array containing only one item from the submitted form.
      // This is a workaround for the issue with the "viem" library.
      // It lacks a "method_id" field to uniquely identify the correct method and instead attempts to find a method based on its name.
      // But the name is not unique in the contract ABI and this behavior in the "viem" could result in calling the wrong method.
      // See related issues:
      //    - https://github.com/blockscout/frontend/issues/1032,
      //    - https://github.com/blockscout/frontend/issues/1327
      abi: [ item ] as Abi,
      functionName: methodName,
      address: addressHash as `0x${ string }`,
      value,
    });

    return { source: 'wallet_client', result: { hash } };
  }, [ chainId, isConnected, switchChainAsync, walletClient ]);
}
