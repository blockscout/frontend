import React from 'react';

import EthereumDailyTxsChart from 'ui/charts/EthereumDailyTxsChart';
import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

const Graph = () => {
  return (
    <Page>
      <PageTitle text="Ethereum Daily Transactions Chart"/>
      <EthereumDailyTxsChart/>
    </Page>
  );
};

export default Graph;
