import { Box, Heading } from '@chakra-ui/react';
import React from 'react';

import EthereumChart from 'ui/charts/EthereumChart';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

const Graph = () => {
  return (
    <Page>
      <PageTitle text="Charts"/>
      <Heading as="h2" size="sm" fontWeight="500" mb={ 3 }>Ethereum Daily Transactions & ERC-20 Token Transfer Chart</Heading>
      <Box w="100%" h="400px">
        <EthereumChart/>
      </Box>
    </Page>
  );
};

export default Graph;
