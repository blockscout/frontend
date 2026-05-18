// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { Props as StatusTagProps } from 'ui/shared/statusTag/StatusTag';
import StatusTag from 'ui/shared/statusTag/StatusTag';

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
