import React from 'react';

import NodesStats from 'ui/nodes/NodesStats';
import NodesTable from 'ui/nodes/NodesTable';
import PageTitle from 'ui/shared/Page/PageTitle';

const NodesPageContext: React.FC = () => {
  return (
    <>
      <PageTitle title="Validators" withTextAd/>
      <NodesStats/>
      <NodesTable/>
    </>
  );
};

export default NodesPageContext;
