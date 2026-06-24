// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import type { StatusTagType } from 'src/shared/tags/status-tag/StatusTag';
import StatusTag from 'src/shared/tags/status-tag/StatusTag';

import type { BadgeProps } from 'src/toolkit/chakra/badge';

export interface Props extends BadgeProps {
  status: schemas['Transaction']['status'];
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
