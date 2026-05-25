// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { Props as StatusTagProps } from 'client/shared/tags/status-tag/StatusTag';
import StatusTag from 'client/shared/tags/status-tag/StatusTag';

export interface Props extends Omit<StatusTagProps, 'type' | 'text'> {
  isFinalized: boolean;
}

const CeloEpochStatus = ({ isFinalized, ...rest }: Props) => {
  return (
    <StatusTag
      { ...rest }
      type={ isFinalized ? 'ok' : 'pending' }
      text={ isFinalized ? 'Finalized' : 'In progress' }
    />
  );
};

export default CeloEpochStatus;
