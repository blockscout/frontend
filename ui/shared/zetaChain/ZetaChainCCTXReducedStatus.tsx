import React from 'react';

import type { ZetaChainCCTXStatusReduced } from 'types/api/zetaChain';

import StatusTag, { type StatusTagType } from 'ui/shared/statusTag/StatusTag';

type Props = {
  status: ZetaChainCCTXStatusReduced;
  isLoading?: boolean;
  type?: 'reduced' | 'full';
};

const ZetaChainCCTXReducedStatus = ({ status, isLoading, type = 'reduced' }: Props) => {
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

  if (type === 'full') {
    let text: string;
    switch (status) {
      case 'SUCCESS':
        text = 'Success';
        break;
      case 'PENDING':
        text = 'Pending';
        break;
      case 'FAILED':
        text = 'Failed';
        break;
    }
    return <StatusTag type={ statusTagType } text={ text } size="md" loading={ isLoading }/>;
  }

  return <StatusTag type={ statusTagType } size="sm" loading={ isLoading }/>;
};

export default ZetaChainCCTXReducedStatus;
