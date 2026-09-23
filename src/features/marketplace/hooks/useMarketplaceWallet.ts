// SPDX-License-Identifier: LicenseRef-Blockscout

import type { TypedData } from 'abitype';
import { useCallback } from 'react';
import type { Account, SignTypedDataParameters } from 'viem';
import { useAccount, useSendTransaction, useSwitchChain, useSignMessage, useSignTypedData } from 'wagmi';

import config from 'src/config';

import { useMarketplaceWalletActivity } from './useMarketplaceWalletActivity';

type SendTransactionArgs = {
  chainId?: number;
  mode?: 'prepared';
  to: `0x${ string }` | null;
};

export type SignTypedDataArgs<
  TTypedData extends
  | TypedData |
  {
    [key: string]: unknown;
  } = TypedData,
  TPrimaryType extends string = string,
> = SignTypedDataParameters<TTypedData, TPrimaryType, Account>;

export default function useMarketplaceWallet(appId: string) {
  const { address, chainId } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const { signMessageAsync } = useSignMessage();
  const { signTypedDataAsync } = useSignTypedData();
  const { switchChainAsync } = useSwitchChain();
  const { trackTransaction, logEvent } = useMarketplaceWalletActivity(appId);

  const switchChain = useCallback(
    (chainId: number) => switchChainAsync({ chainId }),
    [ switchChainAsync ],
  );

  const checkAndSwitchChain = useCallback(async() => {
    if (Number(config.chain.id) !== chainId) {
      await switchChain(Number(config.chain.id));
    }
  }, [ chainId, switchChain ]);

  const sendTransaction = useCallback(async(transaction: SendTransactionArgs) => {
    await checkAndSwitchChain();
    return trackTransaction(transaction.to ?? '', () => sendTransactionAsync(transaction));
  }, [ sendTransactionAsync, trackTransaction, checkAndSwitchChain ]);

  const signMessage = useCallback(async(message: string) => {
    await checkAndSwitchChain();
    const signature = await signMessageAsync({ message });
    logEvent('Sign Message');
    return signature;
  }, [ signMessageAsync, logEvent, checkAndSwitchChain ]);

  const signTypedData = useCallback(async(typedData: SignTypedDataArgs) => {
    await checkAndSwitchChain();
    if (typedData.domain) {
      typedData.domain.chainId = Number(typedData.domain.chainId);
    }
    const signature = await signTypedDataAsync(typedData);
    logEvent('Sign Typed Data');
    return signature;
  }, [ signTypedDataAsync, logEvent, checkAndSwitchChain ]);

  return {
    address,
    sendTransaction,
    signMessage,
    signTypedData,
    switchChain,
  };
}
