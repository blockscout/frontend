// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { schemas } from '@blockscout/api-types';

import StatusTag from 'src/shared/tags/status-tag/StatusTag';

import type { BadgeProps } from 'src/toolkit/chakra/badge';
import { Badge } from 'src/toolkit/chakra/badge';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

interface Props extends BadgeProps {
  status: schemas['SmartContract']['creation_status'];
}

const ContractCreationStatus = ({ status, ...rest }: Props) => {
  switch (status) {
    case 'success':
      return (
        <Tooltip content="The contract was successfully created">
          <StatusTag type="ok" text="Success" { ...rest }/>
        </Tooltip>
      );
    case 'failed':
      return (
        <Tooltip content="The creation transaction failed">
          <StatusTag type="error" text="Failed" { ...rest }/>
        </Tooltip>
      );
    case 'selfdestructed':
      return (
        <Tooltip content="The contract was created at some point but has since self-destructed">
          <Badge colorPalette="gray" { ...rest }>Self-destructed</Badge>
        </Tooltip>
      );
    default:
      return null;
  }
};

export default React.memo(ContractCreationStatus);
