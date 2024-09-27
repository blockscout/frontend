import { Button, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { useRewardsContext } from 'lib/contexts/rewards';
import CopyField from 'ui/rewards/CopyField';
import RewardsDashboardCard from 'ui/rewards/RewardsDashboardCard';
import IconSvg from 'ui/shared/IconSvg';
import LinkExternal from 'ui/shared/links/LinkExternal';
import PageTitle from 'ui/shared/Page/PageTitle';

const RewardsDashboard = () => {
  const router = useRouter();
  const { balances, dailyReward, isLogedIn } = useRewardsContext();

  if (!isLogedIn) {
    router.replace({ pathname: '/' }, undefined, { shallow: true });
  }

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
        <Button variant="outline">
          Pre-staking dashboard
        </Button>
        <Flex gap={ 6 }>
          <RewardsDashboardCard
            description="Claim your daily merits and any merits received from referrals."
            values={ [ { label: 'Total balance', value: balances?.total } ] }
            contentAfter={ <Button>Claim { dailyReward?.daily_reward } Merits</Button> }
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
              Refer friends and boost your merits! You receive a 10% bonus on all merits earned by your referrals.
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
            <CopyField label="Referral link" value="blockscout.com/ref/0x789a9201d10029139101"/>
            <CopyField label="Referral code" value="CODE10"/>
            <Flex flexDirection="column">
              <Flex alignItems="center" gap={ 1 } w="120px">
                <IconSvg name="info" boxSize={ 5 } color="gray.500"/>
                <Text fontSize="xs" fontWeight="500" variant="secondary">
                  Referrals
                </Text>
              </Flex>
              <Text fontSize="32px" fontWeight="500">
                0
              </Text>
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
