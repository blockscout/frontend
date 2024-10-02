import { useCallback } from 'react';

import type { RewardsUserDailyClaimResponse } from 'types/api/rewards';

import type { ResourceError } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import { useRewardsContext } from 'lib/contexts/rewards';
import useToast from 'lib/hooks/useToast';

export default function useClaim() {
  const apiFetch = useApiFetch();
  const toast = useToast();
  const { apiToken } = useRewardsContext();

  return useCallback(async() => {
    try {
      const claimResponse = await apiFetch<'rewards_user_daily_claim', RewardsUserDailyClaimResponse>('rewards_user_daily_claim', {
        fetchParams: {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${ apiToken }`,
          },
        },
      });
      if (!('daily_reward' in claimResponse)) {
        throw claimResponse;
      }
    } catch (_error) {
      toast({
        position: 'top-right',
        title: 'Error',
        description: (_error as ResourceError<{ message: string }>)?.payload?.message || 'Something went wrong. Try again later.',
        status: 'error',
        variant: 'subtle',
        isClosable: true,
      });
      throw _error;
    }
  }, [ apiFetch, toast, apiToken ]);
}
