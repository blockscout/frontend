// SPDX-License-Identifier: LicenseRef-Blockscout

import { upperFirst } from 'es-toolkit';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import StatusTag from 'src/shared/tags/status-tag/StatusTag';

import type { BadgeProps } from 'src/toolkit/chakra/badge';

export interface Props extends BadgeProps {
  status: schemas['SignedAuthorization']['status'];
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
