// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import * as tac from '@blockscout/tac-operation-lifecycle-types';

import StatusTag from 'src/shared/tags/status-tag/StatusTag';

import { Tooltip } from 'src/toolkit/chakra/tooltip';

import { ROLLBACK_TOOLTIP } from '../utils/tac-operation';
import { getLegacyTacOperationLabel } from '../utils/tac-operation-legacy';

interface Props {
  type: tac.OperationType;
  isLoading?: boolean;
}

/**
 * The search payload arrives embedded in the **core** `/api/v2/search` response, which still carries the v1
 * operation shape — a `type` that mixes route, state and failure reason. It cannot be reinterpreted as a
 * pure route, so the search surfaces keep reading it here rather than degrading in the shared v2 tag.
 * Retired together with the rest of the v1 usage once core returns the v2 shape:
 * https://github.com/blockscout/frontend/issues/3627
 */
const SearchResultTacOperationStatus = ({ type, isLoading }: Props) => {
  const text = getLegacyTacOperationLabel(type);

  if (!text) {
    return null;
  }

  switch (type) {
    case tac.OperationType.ERROR:
    case tac.OperationType.INSUFFICIENT_FEE:
      return <StatusTag type="error" text={ text } loading={ isLoading }/>;
    case tac.OperationType.ROLLBACK:
      return (
        <Tooltip content={ ROLLBACK_TOOLTIP }>
          <StatusTag type="error" text={ text } loading={ isLoading }/>
        </Tooltip>
      );
    case tac.OperationType.PENDING:
      return <StatusTag type="pending" text={ text } loading={ isLoading }/>;
    default:
      return <StatusTag type="ok" text={ text } loading={ isLoading }/>;
  }
};

export default React.memo(SearchResultTacOperationStatus);
