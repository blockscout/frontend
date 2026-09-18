// SPDX-License-Identifier: LicenseRef-Blockscout

import { useCallback } from 'react';
import { useAccount } from 'wagmi';

import useRewardsActivity from 'src/features/rewards/hooks/useRewardsActivity';

import * as mixpanel from 'src/services/mixpanel';

type WalletAction = mixpanel.EventPayload<mixpanel.EventTypes.WALLET_ACTION>['Action'];

interface WalletActivity {
  readonly logEvent: (action: WalletAction) => void;
  readonly prepareTransaction: (to: string) => Promise<(hash: string) => Promise<void>>;
  readonly trackTransaction: <TResult>(to: string, send: () => Promise<TResult>) => Promise<TResult>;
}

export function useMarketplaceWalletActivity(appId: string, isEssentialDapp = false): WalletActivity {
  const { address, chainId } = useAccount();
  const { trackTransaction, trackTransactionConfirm } = useRewardsActivity();

  const logEvent = useCallback((action: WalletAction) => {
    mixpanel.logEvent(mixpanel.EventTypes.WALLET_ACTION, {
      Action: action,
      Address: address,
      AppId: appId,
      Source: isEssentialDapp ? 'Essential dapps' : 'Dappscout',
      ChainId: isEssentialDapp ? String(chainId) : undefined,
    });
  }, [ address, appId, chainId, isEssentialDapp ]);

  const prepareTransaction = useCallback(async(to: string) => {
    const activity = await trackTransaction(address ?? '', to, isEssentialDapp ? String(chainId) : undefined);
    return async(hash: string) => {
      if (activity?.token) {
        await trackTransactionConfirm(hash, activity.token);
      }
    };
  }, [ address, chainId, isEssentialDapp, trackTransaction, trackTransactionConfirm ]);

  const sendTrackedTransaction = useCallback(async<TResult>(to: string, send: () => Promise<TResult>): Promise<TResult> => {
    const confirmTransaction = await prepareTransaction(to);
    const result = await send();
    if (typeof result === 'string') {
      await confirmTransaction(result);
    }
    logEvent('Send Transaction');
    return result;
  }, [ prepareTransaction, logEvent ]);

  return { logEvent, prepareTransaction, trackTransaction: sendTrackedTransaction };
}
