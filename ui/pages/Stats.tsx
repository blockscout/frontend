import React from 'react';

import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';

import WidgetsList from '../charts/WidgetsList';

const Stats = () => {
  return (
    <Page>
      <PageTitle text="Ethereum Stats"/>
      <WidgetsList/>
    </Page>
  );
};

export default Stats;
