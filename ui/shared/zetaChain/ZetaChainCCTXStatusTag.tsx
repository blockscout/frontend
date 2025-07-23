import React from 'react';

import type { ZetaChainCCTXStatusReduced } from 'types/api/zetaChain';

import StatusTag, { type StatusTagType } from 'ui/shared/statusTag/StatusTag';

const ZetaChainCCTXStatusTag = ({ status, isLoading }: { status: ZetaChainCCTXStatusReduced; isLoading?: boolean }) => {
  let statusTagType: StatusTagType;
  switch (status) {
    case 'SUCCESS':
      statusTagType = 'ok';
      break;
    case 'PENDING':
      statusTagType = 'pending';
      break;
    case 'FAILED':
      statusTagType = 'error';
      break;
  }

  return <StatusTag type={ statusTagType } size="sm" loading={ isLoading }/>;
};

export default ZetaChainCCTXStatusTag;
