import { useCallback, useRef, useEffect } from 'react';

import type { PreSubmitTransactionResponse, PreVerifyContractResponse } from '@blockscout/points-types';

import config from 'configs/app';
import useApiFetch from 'lib/api/useApiFetch';
import useApiQuery from 'lib/api/useApiQuery';
import { useRewardsContext } from 'lib/contexts/rewards';
import { MINUTE } from 'toolkit/utils/consts';
import useProfileQuery from 'ui/snippets/auth/useProfileQuery';

const feature = config.features.rewards;
const LAST_EXPLORE_TIME_KEY = 'rewards_activity_last_explore_time';

type RewardsActivityEndpoint =
  | 'rewards_user_activity_track_tx'
  | 'rewards_user_activity_track_tx_confirm'
  | 'rewards_user_activity_track_contract'
  | 'rewards_user_activity_track_contract_confirm'
  | 'rewards_user_activity_track_usage';

export default function useRewardsActivity() {
  const { apiToken } = useRewardsContext();
  const apiFetch = useApiFetch();
  const lastExploreTime = useRef<number>(0);

  const profileQuery = useProfileQuery();
  const checkActivityPassQuery = useApiQuery('rewards_user_check_activity_pass', {
    queryOptions: {
      enabled: feature.isEnabled && Boolean(apiToken) && Boolean(profileQuery.data?.address_hash),
    },
    queryParams: {
      address: profileQuery.data?.address_hash ?? '',
    },
  });

  useEffect(() => {
    try {
      const storedTime = window.localStorage.getItem(LAST_EXPLORE_TIME_KEY);
      if (storedTime) {
        lastExploreTime.current = Number(storedTime);
      }
    } catch {}
  }, []);

  const makeRequest = useCallback(async(endpoint: RewardsActivityEndpoint, params: Record<string, string>) => {
    if (!apiToken || !checkActivityPassQuery.data?.is_valid) {
      return;
    }

    try {
      return await apiFetch(endpoint, {
        fetchParams: {
          method: 'POST',
          body: params,
          headers: { Authorization: `Bearer ${ apiToken }` },
        },
      });
    } catch {}
  }, [ apiFetch, checkActivityPassQuery.data, apiToken ]);

  const trackTransaction = useCallback(async(from: string, to: string) => {
    return (
      await makeRequest('rewards_user_activity_track_tx', {
        from_address: from,
        to_address: to,
        chain_id: config.chain.id ?? '',
      })
    ) as PreSubmitTransactionResponse | undefined;
  }, [ makeRequest ]);

  const trackTransactionConfirm = useCallback((hash: string, token: string) =>
    makeRequest('rewards_user_activity_track_tx_confirm', { tx_hash: hash, token }),
  [ makeRequest ],
  );

  const trackContract = useCallback(async(address: string) => {
    return (
      await makeRequest('rewards_user_activity_track_contract', {
        address,
        chain_id: config.chain.id ?? '',
      })
    ) as PreVerifyContractResponse | undefined;
  }, [ makeRequest ]);

  const trackContractConfirm = useCallback((token: string) =>
    makeRequest('rewards_user_activity_track_contract_confirm', { token }),
  [ makeRequest ],
  );

  const trackUsage = useCallback((action: string) => {
    // check here because this function is called on page load
    if (!apiToken || !checkActivityPassQuery.data?.is_valid) {
      return;
    }

    if (action === 'explore') {
      const now = Date.now();
      if (now - lastExploreTime.current < 5 * MINUTE) {
        return;
      }
      lastExploreTime.current = now;
      try {
        window.localStorage.setItem(LAST_EXPLORE_TIME_KEY, String(now));
      } catch {}
    }

    return makeRequest('rewards_user_activity_track_usage', {
      action,
      chain_id: config.chain.id ?? '',
    });
  }, [ makeRequest, apiToken, checkActivityPassQuery.data ]);

  return {
    trackTransaction,
    trackTransactionConfirm,
    trackContract,
    trackContractConfirm,
    trackUsage,
  };
}
