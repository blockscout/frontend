import React from 'react';

import ProvidersTable from 'ui/providers/ProvidersTable';
import ProvidersStats from 'ui/providers/ProvidesStats';
import PageTitle from 'ui/shared/Page/PageTitle';

const ProviderPageContext: React.FC = () => {
  return (
    <div style={{ width: '100%' }}>
      <PageTitle title="DHCs" withTextAd/>
      <ProvidersStats/>
      <ProvidersTable/>
    </div>
  );
};

export default ProviderPageContext;
