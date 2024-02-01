import { Flex, Grid, Heading } from '@chakra-ui/react';
import React from 'react';

import ChartWidget from 'ui/shared/chart/ChartWidget';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import PageTitle from 'ui/shared/Page/PageTitle';
import InfoBlock from 'ui/staking/InfoBlock';
import StakingStats from 'ui/staking/StakingStats';

const Staking = () => {
  const chartData = [
    {
      date: '2024-01-01',
      value: '22.754379629407154',
    },
    {
      date: '2024-01-02',
      value: '27.453057189560774',
    },
    {
      date: '2024-01-03',
      value: '43.10447337606563',
    },
    {
      date: '2024-01-04',
      value: '7.411615351008571',
    },
  ];

  const detailsInfoItems = [
    {
      title: 'Total Validators',
      hint: 'Validators secure the Polkadot Relay Chain by validating blocks.',
      isLoading: false,
      value: '1,017',
    },
    {
      title: 'Total Nominators',
      hint: 'Stakers in the network include accounts, whether active or inactive in the current session.',
      isLoading: false,
      value: '41,179',
    },
    {
      title: 'Active Pools',
      hint: 'The current amount of active nomination pools on Polkadot.',
      isLoading: false,
      value: '201',
    },
    {
      title: 'Inflation Rate to Stakers',
      hint: 'DOT has unlimited supply with ~10% annual inflation. Validator rewards depend on staked amounts.',
      isLoading: false,
      value: '8.99%',
    },
  ];

  const updatedChartData: Array<{ date: Date; value: number }> = chartData.map(
    (item) => ({
      date: new Date(item.date),
      value: Number(item.value),
    }),
  );

  return (
    <div>
      <PageTitle title="Overview"/>
      <StakingStats/>
      <ChartWidget
        marginTop="20px"
        items={ updatedChartData }
        title="Recent Payouts"
        units="DOT"
        description="0 DOT"
        isLoading={ false }
        isError={ false }
        minH="230px"
      />
      <Heading as="h4" size="sm" mt={ 4 } mb={ 4 }>
				Network Stats
      </Heading>
      <Flex
        direction={{ base: 'column', lg: 'column' }}
        marginTop={ 4 }
        alignItems="flex-start"
        gap={ 8 }
      >
        <Flex
          direction={{ base: 'column', lg: 'column' }}
          marginTop={ 4 }
          alignItems="flex-start"
          gap={ 8 }
        >
          <Grid
            gridTemplateColumns={{
              lg: `repeat(8, 1fr)`,
              base: '1fr 1fr',
            }}
            gridTemplateRows={{ lg: 'none', base: undefined }}
            gridGap="10px"
            alignItems="center"
          >
            { detailsInfoItems.map((item, index) => (
              <DetailsInfoItem
                key={ index }
                title={ item.title }
                hint={ item.hint }
                isLoading={ item.isLoading }
              >
                { item.value }
              </DetailsInfoItem>
            )) }
          </Grid>
        </Flex>
        <InfoBlock/>
      </Flex>
    </div>
  );
};

export default Staking;
