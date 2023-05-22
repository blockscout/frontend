import { Box, Heading } from '@chakra-ui/react';
import React from 'react';

import EthereumChart from 'ui/charts/EthereumChart';
import SplineChartExample from 'ui/charts/SplineChartExample';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

const Graph = () => {
  return (
    <Page>
      <PageTitle title="Charts"/>
      <Heading as="h2" size="sm" fontWeight="500" mb={ 3 }>Ethereum Daily Transactions & ERC-20 Token Transfer Chart</Heading>
      <Box w="100%" h="400px">
        <EthereumChart/>
      </Box>
      <Heading as="h2" size="sm" fontWeight="500" mb={ 3 } mt="80px">Ethereum Daily Transactions For Last Month</Heading>
      <Box w="240px" h="150px">
        <SplineChartExample/>
      </Box>
    </Page>
  );
};

export default Graph;
