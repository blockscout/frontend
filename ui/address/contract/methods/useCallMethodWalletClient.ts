import React from 'react';
import { getAddress, type Abi } from 'viem';
import { useAccount, useWalletClient, useSwitchChain } from 'wagmi';

import type { FormSubmitResult, SmartContractMethod } from './types';

import config from 'configs/app';
import { useMultichainContext } from 'lib/contexts/multichain';
import useRewardsActivity from 'lib/hooks/useRewardsActivity';

import { getNativeCoinValue } from './utils';

interface Params {
  item: SmartContractMethod;
  args: Array<unknown>;
  addressHash: string;
}

export default function useCallMethodWalletClient(): (params: Params) => Promise<FormSubmitResult> {
  const multichainContext = useMultichainContext();
  const chainConfig = (multichainContext?.chain.config ?? config).chain;

  const { data: walletClient } = useWalletClient({ chainId: Number(chainConfig.id) });
  const { isConnected, chainId, address: account } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { trackTransaction, trackTransactionConfirm } = useRewardsActivity();

  return React.useCallback(async({ args, item, addressHash }) => {
    if (!isConnected) {
      throw new Error('Wallet is not connected');
    }

    if (!walletClient) {
      throw new Error('Wallet Client is not defined');
    }

    if (chainId && String(chainId) !== chainConfig.id) {
      await switchChainAsync({ chainId: Number(chainConfig.id) });
    }

    const address = getAddress(addressHash);
    const activityResponse = await trackTransaction(account ?? '', address);

    // for payable methods we add additional input for native coin value
    const inputs = 'inputs' in item ? item.inputs : [];
    const _args = args.slice(0, inputs.length);
    const value = getNativeCoinValue(args[inputs.length]);

    if (item.type === 'receive' || item.type === 'fallback') {
      // if the fallback method acts as a read method, it can only have one input of type bytes
      // so we pass the input value as data without encoding it
      const data = typeof _args[0] === 'string' && _args[0].startsWith('0x') ? _args[0] as `0x${ string }` : undefined;
      const hash = await walletClient.sendTransaction({
        to: address,
        value,
        ...(data ? { data } : {}),
      });

      if (activityResponse?.token) {
        await trackTransactionConfirm(hash, activityResponse.token);
      }

      return { source: 'wallet_client', data: { hash } };
    }

    const methodName = item.name;

    if (!methodName) {
      throw new Error('Method name is not defined');
    }

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
      address,
      value,
      account,
    });

    if (activityResponse?.token) {
      await trackTransactionConfirm(hash, activityResponse.token);
    }

    return { source: 'wallet_client', data: { hash } };
  }, [ chainId, chainConfig, isConnected, switchChainAsync, walletClient, account, trackTransaction, trackTransactionConfirm ]);
}
