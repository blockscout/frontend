import { Flex, Skeleton, Image, Alert } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

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
  const { balancesQuery, apiToken, referralsQuery, rewardsConfigQuery, dailyRewardQuery, isInitialized } = useRewardsContext();
  const [ isError, setIsError ] = useState(false);

  useRedirectForInvalidAuthToken();

  useEffect(() => {
    if (!config.features.rewards.isEnabled || (isInitialized && !apiToken)) {
      window.location.assign('/');
    }
  }, [ isInitialized, apiToken ]);

  useEffect(() => {
    setIsError(balancesQuery.isError || referralsQuery.isError || rewardsConfigQuery.isError || dailyRewardQuery.isError);
  }, [ balancesQuery.isError, referralsQuery.isError, rewardsConfigQuery.isError, dailyRewardQuery.isError ]);

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
        { isError && <Alert status="error">Failed to load some data. Please try again later.</Alert> }
        <Flex gap={ 6 } flexDirection={{ base: 'column', md: 'row' }}>
          <RewardsDashboardCard
            description="Claim your daily Merits and any Merits received from referrals."
            direction="column-reverse"
            contentAfter={ <DailyRewardClaimButton/> }
          >
            <RewardsDashboardCardValue
              label="Total balance"
              value={ balancesQuery.data?.total || 'N/A' }
              isLoading={ balancesQuery.isPending }
              withIcon
              hint={ (
                <>
                  Total number of Merits earned from all activities.{ ' ' }
                  <LinkExternal href="https://docs.blockscout.com/using-blockscout/merits">
                    More info on Merits
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
              value={ referralsQuery.data?.referrals ?
                `${ referralsQuery.data?.referrals } user${ Number(referralsQuery.data?.referrals) === 1 ? '' : 's' }` :
                'N/A'
              }
              isLoading={ referralsQuery.isPending }
              hint="The number of referrals who registered with your code/link."
            />
          </RewardsDashboardCard>
          <RewardsDashboardCard
            title="Streaks"
            description={ `Current number of consecutive days you${ apos }ve claimed your daily Merits.` }
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
              Refer friends and boost your Merits! You receive a{ ' ' }
              <Skeleton as="span" isLoaded={ !rewardsConfigQuery.isPending }>
                { rewardsConfigQuery.data?.rewards.referral_share ?
                  `${ Number(rewardsConfigQuery.data?.rewards.referral_share) * 100 }%` :
                  'N/A'
                }
              </Skeleton>
              { ' ' }bonus on all Merits earned by your referrals.
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
              value={ referralsQuery.data?.link || 'N/A' }
              isLoading={ referralsQuery.isPending }
              flex={ 2 }
            />
            <RewardsReadOnlyInputWithCopy
              label="Referral code"
              value={ referralsQuery.data?.code || 'N/A' }
              isLoading={ referralsQuery.isPending }
              flex={ 1 }
            />
          </Flex>
        </RewardsDashboardCard>
        <Flex gap={ 6 } flexDirection={{ base: 'column', md: 'row' }}>
          <RewardsDashboardCard
            title="Activity"
            description="Earn Merits for your everyday Blockscout activities. You deserve to be rewarded for choosing open-source public goods!"
            availableSoon
            blurFilter
          >
            <RewardsDashboardCardValue label="Activity" value="0%"/>
            <RewardsDashboardCardValue label="Received" value="0" withIcon/>
          </RewardsDashboardCard>
          <RewardsDashboardCard
            title="Verify contracts"
            description="Verified contracts are so important for transparency and interaction. Verify your contracts on Blockscout and receive Merits for your efforts." // eslint-disable-line max-len
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
            gap={ 2 }
          >
            { Array(5).fill(null).map((_, index) => (
              <Image
                key={ index }
                display={{ base: index > 2 ? 'none' : 'block', sm: 'block' }}
                src={ `/static/badges/badge_${ index + 1 }.svg` }
                alt={ `Badge ${ index + 1 }` }
                w={{ base: 'calc((100% - 16px) / 3)', sm: 'calc((100% - 32px) / 5)' }}
                maxW={{ base: '80px', md: '100px' }}
                maxH={{ base: '80px', md: '100px' }}
                fallback={ (
                  <Skeleton
                    display={{ base: index > 2 ? 'none' : 'block', sm: 'block' }}
                    w={{ base: 'calc((100% - 16px) / 3)', sm: 'calc((100% - 32px) / 5)' }}
                    maxW={{ base: '80px', md: '100px' }}
                    maxH={{ base: '80px', md: '100px' }}
                    aspectRatio={ 1 }
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
