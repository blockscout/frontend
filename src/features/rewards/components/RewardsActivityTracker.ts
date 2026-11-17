// SPDX-License-Identifier: LicenseRef-Blockscout

import { useEffect } from 'react';

import useRewardsActivity from 'src/features/rewards/hooks/useRewardsActivity';

import { useRouter } from 'src/shared/router/useRouter';

const RewardsActivityTracker = () => {
  const router = useRouter();
  const { trackUsage } = useRewardsActivity();

  useEffect(() => {
    trackUsage('explore');
  }, [ router.pathname, router.query, trackUsage ]);

  return null;
};

export default RewardsActivityTracker;
