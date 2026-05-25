// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { InteropMessage } from 'client/features/op-interop/types/api';

import type { StatusTagType } from 'client/shared/tags/status-tag/StatusTag';
import StatusTag from 'client/shared/tags/status-tag/StatusTag';

export interface Props {
  status: InteropMessage['status'];
  isLoading?: boolean;
}

const InteropMessageStatus = ({ status, isLoading }: Props) => {
  let type: StatusTagType;

  switch (status) {
    case 'Relayed': {
      type = 'ok';
      break;
    }
    case 'Failed': {
      type = 'error';
      break;
    }
    case 'Sent': {
      type = 'pending';
      break;
    }
    default:
      type = 'pending';
      break;
  }

  return <StatusTag type={ type } text={ status } loading={ isLoading }/>;
};

export default InteropMessageStatus;
