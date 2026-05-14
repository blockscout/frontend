// SPDX-License-Identifier: LicenseRef-Blockscout

import { upperFirst } from 'es-toolkit';
import React from 'react';

import type { TxAuthorization } from 'client/features/tx-authorization/types/api';

import type { BadgeProps } from 'toolkit/chakra/badge';

import StatusTag from './StatusTag';

export interface Props extends BadgeProps {
  status: TxAuthorization['status'];
}

const TxAuthorizationStatus = ({ status, ...rest }: Props) => {

  const type = (() => {
    if (!status) {
      return 'pending';
    }
    if (status === 'ok') {
      return 'ok';
    }
    return 'error';
  })();

  const text = (() => {
    if (!status) {
      return 'Pending';
    }
    if (status === 'ok') {
      return 'Success';
    }
    return upperFirst(status.replace('_', ' '));
  })();

  return <StatusTag { ...rest } type={ type } text={ text }/>;
};

export default TxAuthorizationStatus;
