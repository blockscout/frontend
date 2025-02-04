import { Box, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import * as d3 from 'd3';
import React from 'react';

import { useFetchStakersInfo } from 'lib/getStakersInfo';
import type { LegendItem } from 'ui/shared/chart/Legend';
import PieChartWidget from 'ui/shared/stats/PieChartWidget';
import StatsWidget from 'ui/shared/stats/StatsWidget';

const ValidatorsCounters = () => {
  const { data: validatorsData } = useFetchStakersInfo();
  const totalRWAStaked = validatorsData.reduce(
    (acc, validator) => acc + parseFloat(validator.total_rwa_staked),
    0,
  );
  const totalRWADelegated = validatorsData.reduce(
    (acc, validator) => acc + parseFloat(validator.total_rwa_delegated),
    0,
  );
  const totalRWARewarded = validatorsData.reduce(
    (acc, validator) => acc + parseFloat(validator.total_fee_reward),
    0,
  );

  const color = d3.scaleOrdinal(d3.schemeCategory10);
  // Sample data for the pie chart

  const data: Array<LegendItem> = [
    { value: totalRWAStaked, label: 'Validator Stake', color: color('0') },
    { value: totalRWADelegated, label: 'Delegator Stake', color: color('1') },
  ];

  const chartData: Array<LegendItem> = [
    {
      value: Number(
        Number(
          (
            (totalRWAStaked / (totalRWAStaked + totalRWADelegated)) *
            100
          ).toFixed(1),
        ),
      ),
      label: 'Validator Stake',
      color: color('0'),
    },
    {
      value: Number(
        Number(
          (
            (totalRWADelegated / (totalRWAStaked + totalRWADelegated)) *
            100
          ).toFixed(1),
        ),
      ),
      label: 'Delegator Stake',
      color: color('1'),
    },
  ];

  return (
    <Box
      columnGap={ 3 }
      rowGap={ 3 }
      mb={ 6 }
      display="grid"
      gridTemplateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
    >
      { chartData[0].value > 0 && (
        <PieChartWidget
          label=""
          value=""
          isLoading={ false }
          data={ data }
          chartData={ chartData }
        />
      ) }
      <Flex
        alignItems="flex-start"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box w="100%" h="100%">
          <StatsWidget
            label="Total Validators"
            value={ String(validatorsData.length) }
            isLoading={ false }
          />
        </Box>
        <Box w="100%" h="100%">
          <StatsWidget
            label="Total Fee Rewarded"
            value={ `${ String(BigNumber(totalRWARewarded).toFormat(2)) } RWA` }
            isLoading={ false }
          />
        </Box>

        <Box w="100%" h="100%">
          <StatsWidget
            label="Total Staked"
            value={ `${ String(BigNumber(totalRWAStaked).toFormat(2)) } RWA` }
            isLoading={ false }
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default React.memo(ValidatorsCounters);
