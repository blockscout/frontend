// SPDX-License-Identifier: LicenseRef-Blockscout

import { capitalize } from 'es-toolkit';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import StatusTag from 'src/shared/tags/status-tag/StatusTag';

const BeaconChainDepositStatusTag = ({ status, isLoading }: { status: schemas['BeaconDeposit']['status']; isLoading: boolean }) => {
  const statusValue = (() => {
    switch (status) {
      case 'pending':
        return 'pending';
      case 'completed':
        return 'ok';
      case 'invalid':
        return 'error';
      default:
        return 'pending';
    }
  })();

  return <StatusTag type={ statusValue } text={ capitalize(status ?? 'unknown') } loading={ isLoading }/>;
};

export default BeaconChainDepositStatusTag;
