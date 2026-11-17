// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import * as tac from '@blockscout/tac-operation-lifecycle-types';

import type { StatusTagType } from 'src/shared/tags/status-tag/StatusTag';
import StatusTag from 'src/shared/tags/status-tag/StatusTag';

import { getTacOperationStatusText, getTacOperationStatusTooltip } from '../utils/tac-operation';

interface Props {
  status: tac.V2OperationStatus;
  type: tac.V2OperationType;
  errorReason?: string | null;
  isLoading?: boolean;
  isRollback?: boolean;
}

const STATUS_TAG_TYPES: Record<tac.V2OperationStatus, StatusTagType> = {
  [tac.V2OperationStatus.pending]: 'pending',
  [tac.V2OperationStatus.success]: 'ok',
  [tac.V2OperationStatus.failed]: 'error',
  [tac.V2OperationStatus.UNRECOGNIZED]: 'pending',
};

/**
 * One tag carrying both facts the v2 contract separates: the icon and colour come from `status`, the text
 * from `type`. Keeping them combined is a standing product decision — a split into two fields was rejected.
 */
const TacOperationStatus = ({ status, type, errorReason, isLoading, isRollback }: Props) => {
  return (
    <StatusTag
      type={ STATUS_TAG_TYPES[status] }
      text={ getTacOperationStatusText(status, type) }
      errorText={ getTacOperationStatusTooltip(status, errorReason, isRollback) }
      loading={ isLoading }
    />
  );
};

export default React.memo(TacOperationStatus);
