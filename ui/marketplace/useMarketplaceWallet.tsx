import type { TypedData } from 'abitype';
import { useCallback } from 'react';
import type { Account, SignTypedDataParameters } from 'viem';
import { useAccount, useSendTransaction, useSwitchChain, useSignMessage, useSignTypedData } from 'wagmi';

import config from 'configs/app';
import useRewardsActivity from 'lib/hooks/useRewardsActivity';
import * as mixpanel from 'lib/mixpanel/index';

type SendTransactionArgs = {
  chainId?: number;
  mode?: 'prepared';
  to: `0x${ string }` | null;
};

export type SignTypedDataArgs<
  TTypedData extends
  | TypedData
  | {
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
  const { trackTransaction, trackTransactionConfirm } = useRewardsActivity();

  const logEvent = useCallback((event: mixpanel.EventPayload<mixpanel.EventTypes.WALLET_ACTION>['Action']) => {
    mixpanel.logEvent(
      mixpanel.EventTypes.WALLET_ACTION,
      { Action: event, Address: address, AppId: appId },
    );
  }, [ address, appId ]);

  const switchNetwork = useCallback(async() => {
    if (Number(config.chain.id) !== chainId) {
      await switchChainAsync?.({ chainId: Number(config.chain.id) });
    }
  }, [ chainId, switchChainAsync ]);

  const sendTransaction = useCallback(async(transaction: SendTransactionArgs) => {
    await switchNetwork();
    const activityResponse = await trackTransaction(address ?? '', transaction.to ?? '');
    const tx = await sendTransactionAsync(transaction);
    if (activityResponse?.token) {
      await trackTransactionConfirm(tx, activityResponse.token);
    }
    logEvent('Send Transaction');
    return tx;
  }, [ sendTransactionAsync, switchNetwork, logEvent, trackTransaction, trackTransactionConfirm, address ]);

  const signMessage = useCallback(async(message: string) => {
    await switchNetwork();
    const signature = await signMessageAsync({ message });
    logEvent('Sign Message');
    return signature;
  }, [ signMessageAsync, switchNetwork, logEvent ]);

  const signTypedData = useCallback(async(typedData: SignTypedDataArgs) => {
    await switchNetwork();
    if (typedData.domain) {
      typedData.domain.chainId = Number(typedData.domain.chainId);
    }
    const signature = await signTypedDataAsync(typedData);
    logEvent('Sign Typed Data');
    return signature;
  }, [ signTypedDataAsync, switchNetwork, logEvent ]);

  return {
    address,
    sendTransaction,
    signMessage,
    signTypedData,
  };
}
