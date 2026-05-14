// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { Transaction } from 'client/slices/tx/types/api';

import type { BadgeProps } from 'toolkit/chakra/badge';
import type { StatusTagType } from 'ui/shared/statusTag/StatusTag';
import StatusTag from 'ui/shared/statusTag/StatusTag';

export interface Props extends BadgeProps {
  status: Transaction['status'];
  errorText?: string | null;
  isLoading?: boolean;
}

const TxStatus = ({ status, errorText, isLoading, ...rest }: Props) => {
  if (status === undefined) {
    return null;
  }

  let text;
  let type: StatusTagType;

  switch (status) {
    case 'ok':
      text = 'Success';
      type = 'ok';
      break;
    case 'error':
      text = 'Failed';
      type = 'error';
      break;
    case null:
      text = 'Pending';
      type = 'pending';
      break;
  }

  return <StatusTag type={ type } text={ text } errorText={ errorText } loading={ isLoading } { ...rest }/>;
};

export default TxStatus;
