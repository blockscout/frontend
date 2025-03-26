import { Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import config from 'configs/app';
import { useRewardsContext } from 'lib/contexts/rewards';
import { apos } from 'lib/html-entities';
import { Alert } from 'toolkit/chakra/alert';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import DailyRewardClaimButton from 'ui/rewards/dashboard/DailyRewardClaimButton';
import RewardsDashboardCard from 'ui/rewards/dashboard/RewardsDashboardCard';
import RewardsDashboardCardValue from 'ui/rewards/dashboard/RewardsDashboardCardValue';
import RewardsDashboardInfoCard from 'ui/rewards/dashboard/RewardsDashboardInfoCard';
import RewardsReadOnlyInputWithCopy from 'ui/rewards/RewardsReadOnlyInputWithCopy';
import AdBanner from 'ui/shared/ad/AdBanner';
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

  let shareText = `Claim your free @blockscout #Merits and start building your daily streak today! #Blockscout #Merits #IYKYK\n\nBoost your rewards instantly by using my referral code: ${ referralsQuery.data?.link }`; // eslint-disable-line max-len

  if (dailyRewardQuery.data?.streak && Number(dailyRewardQuery.data.streak) > 0) {
    const days = `day${ Number(dailyRewardQuery.data.streak) === 1 ? '' : 's' }`;
    shareText = `I${ apos }ve claimed Merits ${ dailyRewardQuery.data.streak } ${ days } in a row!\n\n` + shareText;
  }

  return (
    <>
      <Flex gap={ 3 } justifyContent="space-between">
        <PageTitle
          title="Dashboard"
          secondRow={ (
            <span>
              The Blockscout Merits Program is just getting started! Learn more about the details,
              features, and future plans in our{ ' ' }
              <Link external href={ `https://merits.blockscout.com/?tab=users&utm_source=${ config.chain.id }&utm_medium=text-banner` }>
                blog post
              </Link>.
            </span>
          ) }
        />
        <AdBanner platform="mobile" w="fit-content" flexShrink={ 0 } borderRadius="md" overflow="hidden" display={{ base: 'none', lg: 'block ' }}/>
      </Flex>
      <Flex flexDirection="column" alignItems="flex-start" w="full" gap={ 6 }>
        { isError && <Alert status="error">Failed to load some data. Please try again later.</Alert> }
        <Flex gap={ 6 } flexDirection={{ base: 'column', md: 'row' }} w="full">
          <RewardsDashboardCard
            title="All Merits"
            description="Claim your daily Merits and any Merits received from referrals."
            direction="column-reverse"
            contentAfter={ <DailyRewardClaimButton/> }
            hint={ (
              <>
                Total number of Merits earned from all activities.{ ' ' }
                <Link external href="https://docs.blockscout.com/using-blockscout/merits">
                  More info on Merits
                </Link>
              </>
            ) }
          >
            <RewardsDashboardCardValue
              value={ balancesQuery.data?.total || 'N/A' }
              isLoading={ balancesQuery.isPending }
              withIcon
            />
          </RewardsDashboardCard>
          <RewardsDashboardCard
            title="Referrals"
            description="Total number of users who have joined the program using your code or referral link."
            direction="column-reverse"
          >
            <RewardsDashboardCardValue
              value={ referralsQuery.data?.referrals ?
                `${ referralsQuery.data?.referrals } user${ Number(referralsQuery.data?.referrals) === 1 ? '' : 's' }` :
                'N/A'
              }
              isLoading={ referralsQuery.isPending }
            />
          </RewardsDashboardCard>
          <RewardsDashboardCard
            title="Streak"
            description={ (
              <>
                Current number of consecutive days you{ apos }ve claimed your daily Merits.{ ' ' }
                The longer your streak, the more daily Merits you can earn.{ ' ' }
                <Link external href={ `https://x.com/intent/tweet?text=${ encodeURIComponent(shareText) }` } fontWeight="500">
                  Share on X
                </Link>
              </>
            ) }
            hint={ (
              <>
                See the{ ' ' }
                <Link external href="https://docs.blockscout.com/using-blockscout/merits/streak-rewards">docs</Link>{ ' ' }
                to learn how your streak number affects daily rewards
              </>
            ) }
            direction="column-reverse"
          >
            <RewardsDashboardCardValue
              value={
                dailyRewardQuery.data?.streak ?
                  `${ dailyRewardQuery.data?.streak } day${ Number(dailyRewardQuery.data?.streak) === 1 ? '' : 's' }` :
                  'N/A'
              }
              isLoading={ dailyRewardQuery.isPending }
            />
          </RewardsDashboardCard>
        </Flex>
        <Flex w="full" gap={ 6 } flexDirection={{ base: 'column', md: 'row' }}>
          <RewardsDashboardCard
            title="Referral program"
            description={ (
              <>
                Refer friends and boost your Merits! You receive a{ ' ' }
                <Skeleton as="span" loading={ rewardsConfigQuery.isPending }>
                  { rewardsConfigQuery.data?.rewards.referral_share ?
                    `${ Number(rewardsConfigQuery.data?.rewards.referral_share) * 100 }%` :
                    'N/A'
                  }
                </Skeleton>
                { ' ' }bonus on all Merits earned by your referrals.
              </>
            ) }
          >
            <Flex
              flex={ 1 }
              gap={{ base: 2, lg: 6 }}
              px={{ base: 4, lg: 6 }}
              py={{ base: 4, lg: 0 }}
              flexDirection={{ base: 'column', lg: 'row' }}
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
          <RewardsDashboardInfoCard
            title="Badges"
            description={ `Collect limited and legendary badges by completing different Blockscout related tasks.
              Go to the badges website to see what${ apos }s available and start your collection today.` }
            imageSrc="/static/merits/badges.svg"
            imageWidth="260px"
            imageHeight="86px"
            linkText="View badges"
            linkHref={ `https://merits.blockscout.com/?tab=badges&utm_source=${ config.chain.id }&utm_medium=badges` }
          />
        </Flex>
        <Flex w="full" gap={ 6 } flexDirection={{ base: 'column', md: 'row' }}>
          <RewardsDashboardInfoCard
            title="Blockscout campaigns"
            description="Join Blockscout activities to earn bonus Merits and exclusive rewards from our partners!"
            imageSrc="/static/merits/campaigns.svg"
            imageWidth="180px"
            imageHeight="76px"
            linkText="Check campaigns"
            linkHref={ `https://merits.blockscout.com/?tab=campaigns&utm_source=${ config.chain.id }&utm_medium=campaigns` }
          />
          <RewardsDashboardInfoCard
            title="Use your Merits"
            description="Spend your Merits to get exclusive discounts and offers across several web3 products!"
            imageSrc="/static/merits/offers.svg"
            imageWidth="180px"
            imageHeight="86px"
            linkText="Check offers"
            linkHref={ `https://merits.blockscout.com/?tab=redeem&utm_source=${ config.chain.id }&utm_medium=redeem` }
          />
        </Flex>
        <Flex w="full" gap={ 6 } flexDirection={{ base: 'column', md: 'row' }}>
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
      </Flex>
    </>
  );
};

export default RewardsDashboard;
