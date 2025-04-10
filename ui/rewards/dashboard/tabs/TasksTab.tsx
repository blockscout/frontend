import { Flex, Text, chakra } from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { useRewardsContext } from 'lib/contexts/rewards';
import dayjs from 'lib/date/dayjs';
import { mdash } from 'lib/html-entities';
import { USER_ACTIVITY } from 'stubs/rewards';
import { Button } from 'toolkit/chakra/button';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Heading } from 'toolkit/chakra/heading';
import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import Hint from 'ui/shared/Hint';
import IconSvg from 'ui/shared/IconSvg';
import useProfileQuery from 'ui/snippets/auth/useProfileQuery';

import MeritsIcon from '../../MeritsIcon';
import RewardsInstancesModal from '../RewardsInstancesModal';
import RewardsTaskDetailsModal from '../RewardsTaskDetailsModal';

const feature = config.features.rewards;

function getMaxAmount(rewards: Record<string, string> | undefined) {
  if (!rewards) {
    return 0;
  }

  return Math.max(...Object.values(rewards).map(Number));
}

export default function TasksTab() {
  const { apiToken, rewardsConfigQuery } = useRewardsContext();
  const explorersModal = useDisclosure();
  const taskDetailsModal = useDisclosure();
  const [ selectedTaskIndex, setSelectedTaskIndex ] = useState<number>(0);
  const backgroundImage = useColorModeValue('/static/merits/cells.svg', '/static/merits/cells_dark.svg');

  const profileQuery = useProfileQuery();
  const checkActivityPassQuery = useApiQuery('rewards_user_check_activity_pass', {
    queryOptions: {
      enabled: feature.isEnabled && Boolean(apiToken) && Boolean(profileQuery.data?.address_hash),
    },
    queryParams: {
      address: profileQuery.data?.address_hash ?? '',
    },
  });
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
      const currentPercentile = (current?.percentile || 0) * 100;
      const previousPercentile = (previous?.percentile || 0) * 100;
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

  const activityPassUrl = feature.isEnabled ?
    `${ feature.api.endpoint }/?tab=spend&id=${ rewardsConfigQuery.data?.rewards?.blockscout_activity_pass_id }&utm_source=blockscout&utm_medium=tasks` :
    undefined;

  const tasks = useMemo(() => (
    [
      {
        title: 'Blockscout activity',
        description: (
          <>
            Use Blockscout tools like{ ' ' }
            <Link external href="https://revoke.blockscout.com?utm_source=blockscout&utm_medium=transactions-task">
              Revokescout
            </Link> or{ ' ' }
            <Link external href="https://swap.blockscout.com?utm_source=blockscout&utm_medium=transactions-task">
              Swapscout
            </Link>, or{ ' ' }
            <Link href={ route({ pathname: '/verified-contracts' }) }>
              interact with smart contracts
            </Link>{ ' ' }
            to start earning Merits.
          </>
        ),
        percentile: activities.transactions?.percentile,
        percentileDiff: activities.transactions?.percentileDiff,
        amount: activities.transactions?.amount,
        amountDiff: activities.transactions?.amountDiff,
        maxAmount: getMaxAmount(rewardsConfigQuery.data?.rewards?.sent_transactions_activity_rewards),
      },
      {
        title: 'Contracts verification',
        description: (
          <>
            Log in to your Blockscout account and{ ' ' }
            <Link href={ route({ pathname: '/contract-verification' }) }>
              verify a smart contract
            </Link>{ ' ' }
            using Blockscout website to earn Merits.
          </>
        ),
        percentile: activities.contracts?.percentile,
        percentileDiff: activities.contracts?.percentileDiff,
        amount: activities.contracts?.amount,
        amountDiff: activities.contracts?.amountDiff,
        maxAmount: getMaxAmount(rewardsConfigQuery.data?.rewards?.verified_contracts_activity_rewards),
      },
      {
        title: 'Blockscout usage',
        description: (
          <>
            Use Blockscout explorers in your daily routine { mdash } check transactions, explore addresses,
            or add tokens/networks to MetaMask via Blockscout.
          </>
        ),
        percentile: activities.usage?.percentile,
        percentileDiff: activities.usage?.percentileDiff,
        amount: activities.usage?.amount,
        amountDiff: activities.usage?.amountDiff,
        maxAmount: getMaxAmount(rewardsConfigQuery.data?.rewards?.blockscout_usage_activity_rewards),
      },
    ]
  ), [ rewardsConfigQuery, activities ]);

  const openTaskDetails = useCallback((index: number) => () => {
    setSelectedTaskIndex(index);
    taskDetailsModal.onOpen();
  }, [ taskDetailsModal ]);

  if (checkActivityPassQuery.data && !checkActivityPassQuery.data.is_valid) {
    return (
      <Flex
        p={{ base: 1.5, md: 2 }}
        border="1px solid"
        borderColor={{ _light: 'gray.200', _dark: 'whiteAlpha.200' }}
        borderRadius="lg"
        gap={{ base: 1, md: 10 }}
        flexDirection={{ base: 'column', md: 'row' }}
      >
        <Flex flex={ 1 } flexDirection="column" p={ 3 } gap={ 2 }>
          <Heading textStyle={{ base: 'heading.sm', md: 'heading.md' }}>
            Activity pass
          </Heading>
          <Text textStyle="sm">
            Grab your{ ' ' }
            <Link external href={ activityPassUrl } loading={ rewardsConfigQuery.isLoading }>
              Activity pass
            </Link>{ ' ' }
            then engage with various Blockscout products and features to earn Merits every day!{ ' ' }
            <Link external>Learn more</Link>
          </Text>
        </Flex>
        <Flex
          flex={{ base: 'none', md: 1 }}
          flexDirection={{ base: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          h={{ base: '160px', md: '120px' }}
          pr={{ base: 0, md: 8 }}
          pl={{ base: 0, md: '86px' }}
          pt={{ base: 4, md: 0 }}
          pb={{ base: 3, md: 0 }}
          borderRadius="base"
          backgroundColor={{ _light: '#FFEFCE', _dark: '#E1910E' }}
          overflow="hidden"
          position="relative"
        >
          <Image
            src={ backgroundImage }
            alt="Background"
            width="268px"
            height="184px"
            position="absolute"
            top="-20px"
            left={{ base: 'calc(50% - 134px)', md: '-8px' }}
          />
          <Image
            src="/static/merits/activity_pass.svg"
            alt="Activity pass"
            width="79px"
            height="86px"
            zIndex={ 1 }
          />
          <Link
            external
            href={ activityPassUrl }
            variant="underlaid"
            fontWeight="500"
            backgroundColor={{ _light: '#FFD57C', _dark: '#FFBA0D' }}
            color="#2B1A3F"
            iconColor="rgba(43, 26, 63, 0.3)"
            _hover={{ color: 'link.primary.hover' }}
            flexShrink={ 0 }
            zIndex={ 1 }
          >
            Grab Activity pass
          </Link>
        </Flex>
      </Flex>
    );
  }

  const isActivityDataLoading = activityQuery.isPlaceholderData || checkActivityPassQuery.isPending;

  return (
    <>
      <Flex
        p={{ base: 1.5, md: 2 }}
        border="1px solid"
        borderColor={{ _light: 'gray.200', _dark: 'whiteAlpha.200' }}
        borderRadius="lg"
        gap={{ base: 1, md: 10 }}
      >
        <Flex flexDirection="column" w={{ base: 'full', md: '340px' }} p={ 3 } pr={ 0 }>
          <Heading textStyle={{ base: 'heading.sm', md: 'heading.md' }} mb={ 2 }>Tasks</Heading>
          <Text textStyle="sm" mb={ 4 }>
            Use Blockscout and related products daily to earn Merits. Check each task for details and how to get started.
          </Text>
          <Flex alignItems="center" gap={ 3 } mb={ 4 }>
            <Button
              flex={{ base: 1, md: 'none' }}
              loadingSkeleton={ instancesQuery.isLoading }
              onClick={ explorersModal.onOpen }
            >
              Earn
            </Button>
            <Link
              external
              fontSize="md"
              fontWeight="500"
              textAlign="center"
              flex={{ base: 1, md: 'none' }}
              px={{ base: 4, md: 0 }}
            >
              Learn more
            </Link>
          </Flex>
          <IconSvg name="status/warning" boxSize={ 6 } mt="auto" mb={ 2.5 } color="gray.500"/>
          <Text textStyle="sm">
            <chakra.span fontWeight="600">Your current Merit count is not final!</chakra.span><br/>
            Merits are calculated based on the activity of all users and may increase or decrease by the end of the period.
          </Text>
        </Flex>
        <Flex flex={ 1 } flexDirection="column" gap={ 1 } css={{ '& > div > *': { flex: 1 } }}>
          <Flex p={ 3 } gap={ 8 }>
            { [
              { text: `Period: ${ period }`, hint: 'Current Merits period. All metrics reset weekly' },
              { text: 'Performance rank', hint: 'Your rank across task groups compared to others. Higher rank = more Merits' },
              { text: 'Merits earned', hint: 'Estimated Merits based on your current rank. Final amount may change' },
            ].map((item, index) => (
              <Flex key={ index } alignItems="center" gap={ 1 } _first={{ minW: '200px' }}>
                <Text textStyle="xs" color="text.secondary" fontWeight="500">
                  { item.text }
                </Text>
                <Hint label={ item.hint }/>
              </Flex>
            )) }
          </Flex>
          { tasks.map((item, index) => (
            <Flex
              key={ index }
              px={ 3 }
              py={ 4 }
              gap={ 8 }
              borderRadius={{ base: 'lg', md: '8px' }}
              backgroundColor={{ _light: 'gray.50', _dark: 'whiteAlpha.50' }}
            >
              <Flex flexDirection="column" gap={ 2 } alignItems="flex-start" minW="200px">
                <Text textStyle="sm" fontWeight="500">
                  { item.title }
                </Text>
                <Link textStyle="xs" fontWeight="500" onClick={ openTaskDetails(index) }>
                  Task details
                </Link>
              </Flex>
              <Flex flexDirection="column" gap={ 2 } alignItems="flex-start">
                <Skeleton loading={ isActivityDataLoading }>
                  <Heading textStyle="heading.md">
                    { item.percentile }
                  </Heading>
                </Skeleton>
                <Skeleton loading={ isActivityDataLoading }>
                  <Text textStyle="xs" color="text.secondary" fontWeight="500">
                    { item.percentileDiff } vs previous week
                  </Text>
                </Skeleton>
              </Flex>
              <Flex flexDirection="column" gap={ 2 } alignItems="flex-start">
                <Skeleton
                  loading={ isActivityDataLoading }
                  display="flex"
                  alignItems="center"
                  gap={ 2 }
                >
                  <MeritsIcon boxSize={ 6 }/>
                  <Heading textStyle="heading.md">
                    { item.amount }
                  </Heading>
                  <Text textStyle="sm" color="gray.400" fontWeight="500" alignSelf="flex-end">
                    /{ item.maxAmount }
                  </Text>
                </Skeleton>
                <Skeleton loading={ isActivityDataLoading }>
                  <Text textStyle="xs" color="text.secondary" fontWeight="500">
                    { item.amountDiff } vs previous week
                  </Text>
                </Skeleton>
              </Flex>
            </Flex>
          )) }
          <Flex p={ 3 }>
            <Text textStyle="xs" color="text.secondary" fontWeight="500">
              Metrics are not updated in real time. Please allow up to one hour for your Performance Rank and earned Merits to reflect recent activity.
              If you experience any issues, feel free to reach out on{ ' ' }
              <Link external href="https://discord.gg/blockscout">
                Discord
              </Link>
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <RewardsInstancesModal
        isOpen={ explorersModal.open }
        onClose={ explorersModal.onClose }
        items={ instancesQuery.data?.items }
      />
      <RewardsTaskDetailsModal
        isOpen={ taskDetailsModal.open }
        onClose={ taskDetailsModal.onClose }
        title={ tasks[selectedTaskIndex].title }
      >
        { tasks[selectedTaskIndex].description }
      </RewardsTaskDetailsModal>
    </>
  );
}
