// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { InteropMessage } from 'client/features/op-interop/types/api';

import type { StatusTagType } from 'ui/shared/statusTag/StatusTag';
import StatusTag from 'ui/shared/statusTag/StatusTag';

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
