import { Box } from '@chakra-ui/react';
import React from 'react';

import EthereumDailyTxsChart from 'ui/charts/EthereumDailyTxsChart';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

const Graph = () => {
  return (
    <Page>
      <PageTitle text="Ethereum Daily Transactions Chart"/>
      <Box w="100%" h="400px">
        <EthereumDailyTxsChart/>
      </Box>
    </Page>
  );
};

export default Graph;
