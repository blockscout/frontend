import { Flex, Box } from '@chakra-ui/react';
import { useMemo } from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { useRewardsContext } from 'lib/contexts/rewards';
import dayjs from 'lib/date/dayjs';
import { USER_ACTIVITY } from 'stubs/rewards';
import { Button } from 'toolkit/chakra/button';
import { Link } from 'toolkit/chakra/link';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';

import RewardsDashboardCard from './RewardsDashboardCard';
import RewardsDashboardCardValue from './RewardsDashboardCardValue';
import RewardsInstancesModal from './RewardsInstancesModal';

const feature = config.features.rewards;

const RewardsDashboardActivitySection = () => {
  const { apiToken } = useRewardsContext();
  const explorersModal = useDisclosure();

  const activityQuery = useApiQuery('rewards_user_activity', {
    queryOptions: {
      enabled: Boolean(apiToken) && feature.isEnabled,
      placeholderData: USER_ACTIVITY,
    },
    fetchParams: { headers: { Authorization: `Bearer ${ apiToken }` } },
  });
  const instancesQuery = useApiQuery('rewards_instances', {
    queryOptions: { enabled: feature.isEnabled },
  });

  const period = useMemo(() => {
    if (!activityQuery.data) {
      return undefined;
    }

    const item = activityQuery.data.items[0];
    const startDate = dayjs(item.date).format('MMM D');
    const endDate = dayjs(item.end_date).format('MMM D, YYYY');

    return `${ startDate } - ${ endDate }`;
  }, [ activityQuery ]);

  const activities = useMemo(() => {
    const calcActivity = (type: string) => {
      const current = activityQuery.data?.items.find((item) => item.activity === type);
      const previous = activityQuery.data?.last_week.find((item) => item.activity === type);

      const currentAmount = Number(current?.amount || 0);
      const previousAmount = Number(previous?.amount || 0);
      const currentPercentile = Number(current?.percentile || 0);
      const previousPercentile = Number(previous?.percentile || 0);
      const amountDiff = currentAmount - previousAmount;
      const percentileDiff = currentPercentile - previousPercentile;

      return {
        amount: currentAmount,
        percentile: `${ currentPercentile }%`,
        amountDiff: `${ amountDiff >= 0 ? '+' : '' }${ amountDiff }`,
        percentileDiff: `${ percentileDiff >= 0 ? '+' : '' }${ percentileDiff }%`,
      };
    };

    return {
      transactions: calcActivity('sent_transactions'),
      contracts: calcActivity('verified_contracts'),
      usage: calcActivity('blockscout_usage'),
    };
  }, [ activityQuery.data ]);

  const activityPassUrl = `${ feature.isEnabled && feature.api.endpoint }/?tab=spend&id=activity-pass&utm_source=blockscout`;

  return (
    <>
      <Flex w="full" gap={ 6 } flexWrap="wrap">
        { [
          {
            title: 'Weekly Blockscout activity',
            description: (
              <>
                Grab your{ ' ' }
                <Link external href={ `${ activityPassUrl }&utm_medium=transactions-task` }>
                  Activity pass
                </Link>{ ' ' }
                then use{ ' ' }
                <Link external href="https://revoke.blockscout.com?utm_source=blockscout&utm_medium=transactions-task">
                  Revokescout
                </Link>,{ ' ' }
                <Link external href="https://swap.blockscout.com?utm_source=blockscout&utm_medium=transactions-task">
                  Swapscout
                </Link>, or{ ' ' }
                <Link href={ route({ pathname: '/verified-contracts' }) }>
                  interact with smart contracts
                </Link>{ ' ' }
                to earn extra Merits each week.
              </>
            ),
            percentileHint: 'Measures your performance relative to other Merit program participants. Complete additional transactions to increase your weekly performance rank.', /* eslint-disable-line max-len */
            amountHint: 'The number of extra Merits you have earned this week from your transactions. Complete additional transactions to earn additional Merits.', /* eslint-disable-line max-len */
            percentile: activities.transactions?.percentile,
            percentileDiff: activities.transactions?.percentileDiff,
            amount: activities.transactions?.amount,
            amountDiff: activities.transactions?.amountDiff,
          },
          {
            title: 'Weekly contracts verification',
            description: (
              <>
                Grab your{ ' ' }
                <Link external href={ `${ activityPassUrl }&utm_medium=verify-contracts-task` }>
                  Activity pass
                </Link>{ ' ' }
                then{ ' ' }
                <Link href={ route({ pathname: '/contract-verification' }) }>
                  verify smart contracts
                </Link>{ ' ' }
                manually on Blockscout for different chains and earn extra Merits every week.
              </>
            ),
            percentileHint: 'Measures your performance relative to other Merit program participants. Verify more contracts to increase your weekly performance rank.', /* eslint-disable-line max-len */
            amountHint: 'The number of extra Merits you have earned this week from your contract verifications. Verify more contracts to earn additional Merits.', /* eslint-disable-line max-len */
            percentile: activities.contracts?.percentile,
            percentileDiff: activities.contracts?.percentileDiff,
            amount: activities.contracts?.amount,
            amountDiff: activities.contracts?.amountDiff,
          },
          {
            title: 'Weekly Blockscout usage',
            description: (
              <>
                Grab your{ ' ' }
                <Link external href={ `${ activityPassUrl }&utm_medium=usage-task` }>
                  Activity pass
                </Link>{ ' ' }
                then just use Blockscout explorers in your every day routine.
              </>
            ),
            percentileHint: 'Measures your performance relative to other Merit program participants. Use Blockscout explorers and add them to a MetaMask wallet to increase your weekly performance rank.', /* eslint-disable-line max-len */
            amountHint: 'The number of extra Merits you have earned this week from your Blockscout usage. Use Blockscout explorers and add them to a MetaMask wallet to earn additional Merits.', /* eslint-disable-line max-len */
            percentile: activities.usage?.percentile,
            percentileDiff: activities.usage?.percentileDiff,
            amount: activities.usage?.amount,
            amountDiff: activities.usage?.amountDiff,
          },
        ].map((item, index) => (
          <RewardsDashboardCard
            key={ index }
            label={ period }
            title={ item.title }
            description={ (
              <Flex flexDir="column" gap={ 3 }>
                <Box wordBreak="break-word">{ item.description }</Box>
                <Flex alignItems="center" gap={ 3 }>
                  <Button
                    flex={{ base: 1, md: 'none' }}
                    loading={ instancesQuery.isLoading }
                    onClick={ explorersModal.onOpen }
                  >
                    Earn
                  </Button>
                  <Link external
                    fontSize="md"
                    fontWeight="500"
                    textAlign="center"
                    flex={{ base: 1, md: 'none' }}
                    px={{ base: 4, md: 0 }}
                  >
                    Learn more
                  </Link>
                </Flex>
              </Flex>
            ) }
            isLoading={ activityQuery.isPlaceholderData }
            cardValueStyle={{ minH: { base: '104px', md: '128px' } }}
            flex={{ base: '1 1 100%', md: '1 1 calc(50% - 12px)' }}
          >
            <RewardsDashboardCardValue
              label="Performance rank"
              value={ item.percentile }
              hint={ item.percentileHint }
              bottomText={ `${ item.percentileDiff } vs previous week` }
              isLoading={ activityQuery.isPlaceholderData }
            />
            <RewardsDashboardCardValue
              label="Merits earned"
              value={ item.amount }
              withIcon
              hint={ item.amountHint }
              bottomText={ `${ item.amountDiff } vs previous week` }
              isLoading={ activityQuery.isPlaceholderData }
            />
          </RewardsDashboardCard>
        )) }
        <Box flex="1 1 calc(50% - 12px)" display={{ base: 'none', md: 'block' }}/>
      </Flex>
      <RewardsInstancesModal
        isOpen={ explorersModal.open }
        onClose={ explorersModal.onClose }
        items={ instancesQuery.data?.items }
      />
    </>
  );
};

export default RewardsDashboardActivitySection;
