import { Box } from '@chakra-ui/react';
import React from 'react';

import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

import StatsFilters from '../stats/StatsFilters';
import WidgetsList from '../stats/WidgetsList';

const Stats = () => {
  return (
    <Page>
      <PageTitle text="Ethereum Stats"/>

      <Box mb={{ base: 6, sm: 8 }}>
        <StatsFilters/>
      </Box>

      <WidgetsList/>
    </Page>
  );
};

export default Stats;
