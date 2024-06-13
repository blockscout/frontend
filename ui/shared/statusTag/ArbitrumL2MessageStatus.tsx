import React from 'react';

import type { ArbitrumL2MessagesItem } from 'types/api/arbitrumL2';

import type { StatusTagType } from './StatusTag';
import StatusTag from './StatusTag';

export interface Props {
  status: ArbitrumL2MessagesItem['status'];
  isLoading?: boolean;
}

const ArbitrumL2MessageStatus = ({ status, isLoading }: Props) => {
  let type: StatusTagType;

  switch (status) {
    case 'relayed':
    case 'confirmed':
      type = 'ok';
      break;
    default:
      type = 'pending';
      break;
  }

  return <StatusTag type={ type } text={ status } isLoading={ isLoading }/>;
};

export default ArbitrumL2MessageStatus;
