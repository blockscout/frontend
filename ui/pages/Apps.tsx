import AppList from '~/ui/apps/AppList';
import { TEMPORARY_DEMO_APPS } from '~/ui/apps/contants';
import Page from '~/ui/shared/Page';
import PageHeader from '~/ui/shared/PageHeader';
import React from 'react';

const Apps = () => {
  return (
    <Page>
      <PageHeader text="Apps"/>
      <AppList apps={ TEMPORARY_DEMO_APPS }></AppList>
    </Page>
  );
};

export default Apps;
