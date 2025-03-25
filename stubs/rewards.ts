import type { RewardsUserActivityResponse } from 'types/api/rewards';

export const USER_ACTIVITY: RewardsUserActivityResponse = {
  items: [
    {
      date: '2025-03-10',
      end_date: '2025-03-16',
      activity: 'sent_transactions',
      amount: '60',
      percentile: '50',
      is_pending: true,
    },
    {
      date: '2025-03-10',
      end_date: '2025-03-16',
      activity: 'verified_contracts',
      amount: '40',
      percentile: '30',
      is_pending: true,
    },
    {
      date: '2025-03-10',
      end_date: '2025-03-16',
      activity: 'blockscout_usage',
      amount: '80',
      percentile: '80',
      is_pending: true,
    },
  ],
  last_week: [
    {
      date: '2025-03-03',
      end_date: '2025-03-09',
      activity: 'sent_transactions',
      amount: '40',
      percentile: '25',
      is_pending: false,
    },
    {
      date: '2025-03-03',
      end_date: '2025-03-09',
      activity: 'verified_contracts',
      amount: '60',
      percentile: '60',
      is_pending: false,
    },
    {
      date: '2025-03-03',
      end_date: '2025-03-09',
      activity: 'blockscout_usage',
      amount: '100',
      percentile: '95',
      is_pending: false,
    },
  ],
} as RewardsUserActivityResponse;
