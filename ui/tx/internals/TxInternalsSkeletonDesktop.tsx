import React from 'react';

import SkeletonTable from 'ui/shared/SkeletonTable';

const TxInternalsSkeletonDesktop = () => {
  return (
    <SkeletonTable columns={ [ '28%', '20%', '24px', '20%', '16%', '16%' ] }/>
  );
};

export default TxInternalsSkeletonDesktop;
