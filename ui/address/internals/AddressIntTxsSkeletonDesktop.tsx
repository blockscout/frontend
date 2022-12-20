import React from 'react';

import SkeletonTable from 'ui/shared/SkeletonTable';

const TxInternalsSkeletonDesktop = () => {
  return (
    <SkeletonTable columns={ [ '15%', '15%', '10%', '20%', '20%', '20%' ] }/>
  );
};

export default TxInternalsSkeletonDesktop;
