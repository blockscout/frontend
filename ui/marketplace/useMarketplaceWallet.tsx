import type { TypedData } from 'abitype';
import { useCallback } from 'react';
import type { Account, SignTypedDataParameters } from 'viem';
import { useAccount, useSendTransaction, useSwitchNetwork, useNetwork, useSignMessage, useSignTypedData } from 'wagmi';

import config from 'configs/app';

type SendTransactionArgs = {
  chainId?: number;
  mode?: 'prepared';
  to: string;
};

export type SignTypedDataArgs<
  TTypedData extends
  | TypedData
  | {
    [key: string]: unknown;
  } = TypedData,
  TPrimaryType extends string = string,
> = SignTypedDataParameters<TTypedData, TPrimaryType, Account>;

export default function useMarketplaceWallet() {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { sendTransactionAsync } = useSendTransaction();
  const { signMessageAsync } = useSignMessage();
  const { signTypedDataAsync } = useSignTypedData();
  const { switchNetworkAsync } = useSwitchNetwork({ chainId: Number(config.chain.id) });

  const switchNetwork = useCallback(async() => {
    if (Number(config.chain.id) !== chain?.id) {
      await switchNetworkAsync?.();
    }
  }, [ chain, switchNetworkAsync ]);

  const sendTransaction = useCallback(async(transaction: SendTransactionArgs) => {
    await switchNetwork();
    const tx = await sendTransactionAsync(transaction);
    return tx.hash;
  }, [ sendTransactionAsync, switchNetwork ]);

  const signMessage = useCallback(async(message: string) => {
    await switchNetwork();
    const signature = await signMessageAsync({ message });
    return signature;
  }, [ signMessageAsync, switchNetwork ]);

  const signTypedData = useCallback(async(typedData: SignTypedDataArgs) => {
    await switchNetwork();
    if (typedData.domain) {
      typedData.domain.chainId = Number(typedData.domain.chainId);
    }
    const signature = await signTypedDataAsync(typedData);
    return signature;
  }, [ signTypedDataAsync, switchNetwork ]);

  return {
    address,
    sendTransaction,
    signMessage,
    signTypedData,
  };
}
