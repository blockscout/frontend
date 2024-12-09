import { useRewardsContext } from 'lib/contexts/rewards';
import { apos } from 'lib/html-entities';

export default function useShareTextForStreak() {
  const { referralsQuery, rewardsConfigQuery, dailyRewardQuery } = useRewardsContext();

  if (!Number(dailyRewardQuery.data?.streak)) {
    return `Claim your free @blockscoutcom #Merits and start building your daily streak today! #Blockscout #Merits #IYKYK\n\nBoost your rewards instantly by using my referral code: ${ referralsQuery.data?.link }`; // eslint-disable-line max-len
  }

  const streakValue = dailyRewardQuery.data?.streak ?
    `${ dailyRewardQuery.data?.streak } day${ Number(dailyRewardQuery.data?.streak) === 1 ? '' : 's' }` :
    'N/A';

  const earnedWithStreak = dailyRewardQuery.data?.streak && rewardsConfigQuery.data?.rewards.daily_claim ?
    `${ Number(rewardsConfigQuery.data?.rewards.daily_claim) * Number(dailyRewardQuery.data?.streak) }` :
    'N/A';

  return `I${ apos }ve claimed @blockscoutcom Merits ${ streakValue } in a row and earned ${ earnedWithStreak } total Merits! #Blockscout #Merits #IYKYK\n\nUse my referral code to get extra points: ${ referralsQuery.data?.link }`; // eslint-disable-line max-len
}
