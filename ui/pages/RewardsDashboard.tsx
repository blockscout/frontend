import { Button, Flex, Skeleton, Text, useBoolean, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';

import { useRewardsContext } from 'lib/contexts/rewards';
import splitSecondsInPeriods from 'ui/blockCountdown/splitSecondsInPeriods';
import CopyField from 'ui/rewards/CopyField';
import RewardsDashboardCard from 'ui/rewards/RewardsDashboardCard';
import HintPopover from 'ui/shared/HintPopover';
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
            values={ [
              {
                label: 'Total balance',
                value: balancesQuery.data?.total,
                hint: (
                  <>
                    Total number of merits earned from all activities.{ ' ' }
                    <LinkExternal href="https://docs.blockscout.com/using-blockscout/my-account/merits">
                      More info on merits
                    </LinkExternal>
                  </>
                ),
              },
            ] }
            contentAfter={ (
              <Button isDisabled={ !dailyRewardQuery.data?.available } onClick={ handleClaim } isLoading={ isClaiming }>
                { dailyRewardQuery.data?.available ?
                  `Claim ${ dailyRewardValue } Merits` :
                  `Next claim in ${ timeLeft }`
                }
              </Button>
            ) }
          />
          <RewardsDashboardCard
            title="Title"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do."
            values={ [ { label: 'Staked amount', value: 0 } ] }
            availableSoon
          />
          <RewardsDashboardCard
            title="Title"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do."
            values={ [ { label: 'Staking rewards', value: 0 } ] }
            availableSoon
          />
        </Flex>
        <Flex
          gap={ 10 }
          w="full"
          border="1px solid"
          borderColor={ useColorModeValue('gray.200', 'whiteAlpha.200') }
          borderRadius="lg"
          p={ 2 }
        >
          <Flex flexDirection="column" gap={ 2 } p={ 3 } w="340px">
            <Text fontSize="lg" fontWeight="500">
              Referral program
            </Text>
            <Text fontSize="sm">
              Refer friends and boost your merits! You receive a{ ' ' }
              <Skeleton as="span" isLoaded={ !rewardsConfigQuery.isLoading }>
                { Number(rewardsConfigQuery.data?.rewards.referral_share || 0) * 100 }%
              </Skeleton>
              { ' ' }bonus on all merits earned by your referrals.
            </Text>
          </Flex>
          <Flex
            flex={ 1 }
            alignItems="center"
            gap={ 6 }
            borderRadius="8px"
            backgroundColor={ useColorModeValue('gray.50', 'whiteAlpha.50') }
            px={ 6 }
            flexShrink={ 0 }
          >
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
            <Flex flexDirection="column">
              <Flex alignItems="center" gap={ 1 } w="120px">
                <HintPopover
                  label="The number of referrals who registered with your code."
                  popoverContentProps={{ maxW: { base: 'calc(100vw - 8px)', lg: '210px' } }}
                  popoverBodyProps={{ textAlign: 'center' }}
                />
                <Text fontSize="xs" fontWeight="500" variant="secondary">
                  Referrals
                </Text>
              </Flex>
              <Skeleton isLoaded={ !referralsQuery.isLoading }>
                <Text fontSize="32px" fontWeight="500">
                  { referralsQuery.data?.referrals || 0 }
                </Text>
              </Skeleton>
            </Flex>
          </Flex>
        </Flex>
        <Flex gap={ 6 }>
          <RewardsDashboardCard
            title="Activity"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            values={ [ { label: 'Activity', value: 0, type: 'percentages' }, { label: 'Received', value: 0 } ] }
            availableSoon
          />
          <RewardsDashboardCard
            title="Verify contracts"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            values={ [ { label: 'Activity', value: 0, type: 'percentages' }, { label: 'Received', value: 0 } ] }
            availableSoon
          />
        </Flex>
      </Flex>
    </>
  );
};

export default RewardsDashboard;
