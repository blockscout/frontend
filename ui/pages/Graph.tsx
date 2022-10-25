import { Box } from '@chakra-ui/react';
import React from 'react';

import EthereumDailyTxsChart from 'ui/charts/EthereumDailyTxsChart';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

const CHART_MARGIN = { bottom: 20, left: 65 };

const Graph = () => {
  return (
    <Page>
      <PageTitle text="Ethereum Daily Transactions Chart"/>
      <Box w="100%" h="400px">
        <EthereumDailyTxsChart margin={ CHART_MARGIN }/>
      </Box>
    </Page>
  );
};

export default Graph;
