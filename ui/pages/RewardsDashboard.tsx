import { Button, Flex, Skeleton, useBoolean } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';

import { useRewardsContext } from 'lib/contexts/rewards';
import { apos } from 'lib/html-entities';
import splitSecondsInPeriods from 'ui/blockCountdown/splitSecondsInPeriods';
import CopyField from 'ui/rewards/CopyField';
import RewardsDashboardCard from 'ui/rewards/RewardsDashboardCard';
import RewardsDashboardCardValue from 'ui/rewards/RewardsDashboardCardValue';
import LinkExternal from 'ui/shared/links/LinkExternal';
import PageTitle from 'ui/shared/Page/PageTitle';

const RewardsDashboard = () => {
  const router = useRouter();
  const {
    balancesQuery, dailyRewardQuery, apiToken, claim,
    referralsQuery, rewardsConfigQuery, isInitialized,
  } = useRewardsContext();
  const [ isClaiming, setIsClaiming ] = useBoolean(false);
  const [ timeLeft, setTimeLeft ] = React.useState<string>('');

  if (isInitialized && !apiToken) {
    router.replace({ pathname: '/' }, undefined, { shallow: true });
  }

  const dailyRewardValue = Number(dailyRewardQuery.data?.daily_reward || 0) + Number(dailyRewardQuery.data?.pending_referral_rewards || 0);

  const handleClaim = useCallback(async() => {
    setIsClaiming.on();
    try {
      await claim();
      balancesQuery.refetch();
      dailyRewardQuery.refetch();
    } catch (error) {}
    setIsClaiming.off();
  }, [ claim, setIsClaiming, balancesQuery, dailyRewardQuery ]);

  useEffect(() => {
    if (!dailyRewardQuery.data?.reset_at) {
      return;
    }
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(dailyRewardQuery.data.reset_at).getTime();
      const difference = target - now;

      if (difference > 0) {
        const { hours, minutes, seconds } = splitSecondsInPeriods(Math.floor(difference / 1000));
        setTimeLeft(`${ hours }:${ minutes }:${ seconds }`);
      } else {
        setTimeLeft('00:00:00');
        dailyRewardQuery.refetch();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [ dailyRewardQuery ]);

  const numberOfReferrals = Number(referralsQuery.data?.referrals || 0);

  return (
    <>
      <PageTitle
        title="Dashboard"
        secondRow={ (
          <>
            The Blockscout Merits Program is just getting started! Learn more about the details,
            features, and future plans in our <LinkExternal ml={ 1 } href="">blog post</LinkExternal>.
          </>
        ) }
      />
      <Flex flexDirection="column" alignItems="flex-start" w="full" gap={ 6 }>
        <Button variant="outline" isDisabled>
          Pre-staking dashboard
        </Button>
        <Flex gap={ 6 }>
          <RewardsDashboardCard
            description="Claim your daily merits and any merits received from referrals."
            direction="column-reverse"
            contentAfter={ (
              <Button isDisabled={ !dailyRewardQuery.data?.available } onClick={ handleClaim } isLoading={ isClaiming }>
                { dailyRewardQuery.data?.available ?
                  `Claim ${ dailyRewardValue } Merits` :
                  `Next claim in ${ timeLeft }`
                }
              </Button>
            ) }
          >
            <RewardsDashboardCardValue
              label="Total balance"
              value={ balancesQuery.data?.total }
              withIcon
              hint={ (
                <>
                  Total number of merits earned from all activities.{ ' ' }
                  <LinkExternal href="https://docs.blockscout.com/using-blockscout/my-account/merits">
                    More info on merits
                  </LinkExternal>
                </>
              ) }
            />
          </RewardsDashboardCard>
          <RewardsDashboardCard
            title="Referrals"
            description="Total number of users who joined the program through your referral link."
            direction="column-reverse"
          >
            <RewardsDashboardCardValue
              label="Referrals"
              value={ `${ numberOfReferrals } user${ numberOfReferrals === 1 ? '' : 's' }` }
              hint="The number of referrals who registered with your code."
            />
          </RewardsDashboardCard>
          <RewardsDashboardCard
            title="Steaks"
            description={ `Current number of consecutive days you${ apos }ve claimed your daily Merits.` }
            direction="column-reverse"
            availableSoon
          >
            <RewardsDashboardCardValue label="Steaks" value="5 days"/>
          </RewardsDashboardCard>
        </Flex>
        <RewardsDashboardCard
          title="Referral program"
          description={ (
            <>
              Refer friends and boost your merits! You receive a{ ' ' }
              <Skeleton as="span" isLoaded={ !rewardsConfigQuery.isLoading }>
                { Number(rewardsConfigQuery.data?.rewards.referral_share || 0) * 100 }%
              </Skeleton>
              { ' ' }bonus on all merits earned by your referrals.
            </>
          ) }
          direction="row"
        >
          <Flex flex={ 1 } gap={ 6 } px={ 6 }>
            <CopyField
              label="Referral link"
              value={ `https://eth.blockscout.com?ref=${ referralsQuery.data?.code }` }
              isLoading={ referralsQuery.isLoading }
            />
            <CopyField
              label="Referral code"
              value={ referralsQuery.data?.code || '' }
              isLoading={ referralsQuery.isLoading }
            />
          </Flex>
        </RewardsDashboardCard>
        <Flex gap={ 6 }>
          <RewardsDashboardCard
            title="Activity"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            availableSoon
          >
            <RewardsDashboardCardValue label="Activity" value="0%"/>
            <RewardsDashboardCardValue label="Received" value="0" withIcon/>
          </RewardsDashboardCard>
          <RewardsDashboardCard
            title="Verify contracts"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            availableSoon
          >
            <RewardsDashboardCardValue label="Activity" value="0%"/>
            <RewardsDashboardCardValue label="Received" value="0" withIcon/>
          </RewardsDashboardCard>
        </Flex>
      </Flex>
    </>
  );
};

export default RewardsDashboard;
