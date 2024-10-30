import { Flex, Skeleton, Image } from '@chakra-ui/react';
import React, { useEffect } from 'react';

import config from 'configs/app';
import { useRewardsContext } from 'lib/contexts/rewards';
import { apos } from 'lib/html-entities';
import DailyRewardClaimButton from 'ui/rewards/dashboard/DailyRewardClaimButton';
import RewardsDashboardCard from 'ui/rewards/dashboard/RewardsDashboardCard';
import RewardsDashboardCardValue from 'ui/rewards/dashboard/RewardsDashboardCardValue';
import RewardsReadOnlyInputWithCopy from 'ui/rewards/RewardsReadOnlyInputWithCopy';
import LinkExternal from 'ui/shared/links/LinkExternal';
import PageTitle from 'ui/shared/Page/PageTitle';
import useRedirectForInvalidAuthToken from 'ui/snippets/auth/useRedirectForInvalidAuthToken';

const RewardsDashboard = () => {
  const { balancesQuery, apiToken, referralsQuery, rewardsConfigQuery, isInitialized } = useRewardsContext();

  useRedirectForInvalidAuthToken();

  useEffect(() => {
    if (!config.features.rewards.isEnabled || (isInitialized && !apiToken)) {
      window.location.assign('/');
    }
  }, [ isInitialized, apiToken ]);

  const numberOfReferrals = Number(referralsQuery.data?.referrals || 0);

  if (!config.features.rewards.isEnabled) {
    return null;
  }

  return (
    <>
      <PageTitle
        title="Dashboard"
        secondRow={ (
          <span>
            The Blockscout Merits Program is just getting started! Learn more about the details,
            features, and future plans in our{ ' ' }
            <LinkExternal href="https://www.blog.blockscout.com/blockscout-merits-rewarding-block-explorer-skills">
              blog post
            </LinkExternal>.
          </span>
        ) }
      />
      <Flex flexDirection="column" alignItems="flex-start" w="full" gap={ 6 }>
        <Flex gap={ 6 } flexDirection={{ base: 'column', md: 'row' }}>
          <RewardsDashboardCard
            description="Claim your daily merits and any merits received from referrals."
            direction="column-reverse"
            contentAfter={ <DailyRewardClaimButton/> }
          >
            <RewardsDashboardCardValue
              label="Total balance"
              value={ balancesQuery.data?.total || 0 }
              isLoading={ balancesQuery.isPending }
              withIcon
              hint={ (
                <>
                  Total number of merits earned from all activities.{ ' ' }
                  <LinkExternal href="https://docs.blockscout.com/using-blockscout/merits">
                    More info on merits
                  </LinkExternal>
                </>
              ) }
            />
          </RewardsDashboardCard>
          <RewardsDashboardCard
            title="Referrals"
            description="Total number of users who have joined the program using your code or referral link."
            direction="column-reverse"
          >
            <RewardsDashboardCardValue
              label="Referrals"
              value={ `${ numberOfReferrals } user${ numberOfReferrals === 1 ? '' : 's' }` }
              isLoading={ referralsQuery.isPending }
              hint="The number of referrals who registered with your code/link."
            />
          </RewardsDashboardCard>
          <RewardsDashboardCard
            title="Streaks"
            description={ `Current number of consecutive days you${ apos }ve claimed your daily merits.` }
            direction="column-reverse"
            availableSoon
            blurFilter
          >
            <RewardsDashboardCardValue label="Streaks" value="5 days"/>
          </RewardsDashboardCard>
        </Flex>
        <RewardsDashboardCard
          title="Referral program"
          description={ (
            <>
              Refer friends and boost your merits! You receive a{ ' ' }
              <Skeleton as="span" isLoaded={ !rewardsConfigQuery.isPending }>
                { Number(rewardsConfigQuery.data?.rewards.referral_share || 0) * 100 }%
              </Skeleton>
              { ' ' }bonus on all merits earned by your referrals.
            </>
          ) }
          direction="row"
        >
          <Flex
            flex={ 1 }
            gap={{ base: 2, md: 6 }}
            px={{ base: 4, md: 6 }}
            py={{ base: 4, md: 0 }}
            flexDirection={{ base: 'column', md: 'row' }}
          >
            <RewardsReadOnlyInputWithCopy
              label="Referral link"
              value={ referralsQuery.data?.link || '' }
              isLoading={ referralsQuery.isPending }
              flex={ 2 }
            />
            <RewardsReadOnlyInputWithCopy
              label="Referral code"
              value={ referralsQuery.data?.code || '' }
              isLoading={ referralsQuery.isPending }
              flex={ 1 }
            />
          </Flex>
        </RewardsDashboardCard>
        <Flex gap={ 6 } flexDirection={{ base: 'column', md: 'row' }}>
          <RewardsDashboardCard
            title="Activity"
            description="Earn merits for your everyday Blockscout activities. You deserve to be rewarded for choosing open-source public goods!"
            availableSoon
            blurFilter
          >
            <RewardsDashboardCardValue label="Activity" value="0%"/>
            <RewardsDashboardCardValue label="Received" value="0" withIcon/>
          </RewardsDashboardCard>
          <RewardsDashboardCard
            title="Verify contracts"
            description="Verified contracts are so important for transparency and interaction. Verify your contracts on Blockscout and receive merits for your efforts." // eslint-disable-line max-len
            availableSoon
            blurFilter
          >
            <RewardsDashboardCardValue label="Activity" value="0%"/>
            <RewardsDashboardCardValue label="Received" value="0" withIcon/>
          </RewardsDashboardCard>
        </Flex>
        <RewardsDashboardCard
          title="Badges"
          description={ (
            <Flex flexDir="column" gap={ 2 }>
              <span>
                Collect limited and legendary badges by completing different Blockscout related tasks.
                Go to the badges website to see what{ apos }s available and start your collection today.
              </span>
              <LinkExternal
                href="https://badges.blockscout.com?utm_source=blockscout&utm_medium=merits-dashboard"
                fontSize="md"
                fontWeight="500"
              >
                Go to website
              </LinkExternal>
            </Flex>
          ) }
          direction="row"
          availableSoon
        >
          <Flex
            flex={ 1 }
            px={{ base: 4, md: 6 }}
            py={{ base: 4, md: 0 }}
            justifyContent="space-between"
          >
            { Array(5).fill(null).map((_, index) => (
              <Image
                key={ index }
                display={{ base: index > 2 ? 'none' : 'block', md: 'block' }}
                src={ `/static/badges/badge_${ index + 1 }.svg` }
                alt={ `Badge ${ index + 1 }` }
                boxSize={{ base: '80px', md: '100px' }}
                fallback={ (
                  <Skeleton
                    boxSize={{ base: '80px', md: '100px' }}
                    display={{ base: index > 2 ? 'none' : 'block', md: 'block' }}
                  />
                ) }
              />
            )) }
          </Flex>
        </RewardsDashboardCard>
      </Flex>
    </>
  );
};

export default RewardsDashboard;
