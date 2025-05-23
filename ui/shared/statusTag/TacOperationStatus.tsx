import React from 'react';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import { getTacOperationStatus } from 'lib/operations/tac';
import { Tooltip } from 'toolkit/chakra/tooltip';

import StatusTag from './StatusTag';

interface Props {
  status: tac.OperationType;
  isLoading?: boolean;
  noTooltip?: boolean;
}

const TacOperationStatus = ({ status, isLoading, noTooltip }: Props) => {
  const text = getTacOperationStatus(status);

  if (!text) {
    return null;
  }

  // TODO @tom2drum remove "as unknown" once the type is fixed
  switch (status as unknown) {
    case 'ERROR':
      return (
        <Tooltip
          // eslint-disable-next-line max-len
          content="The cross‑chain operation was reverted and the original assets and state were returned to the sender after a failure on the destination chain"
          disabled={ noTooltip }
        >
          <StatusTag type="error" text={ text } isLoading={ isLoading }/>
        </Tooltip>
      );
    case 'PENDING': {
      return <StatusTag type="pending" text={ text } isLoading={ isLoading }/>;
    }
    default: {
      return <StatusTag type="ok" text={ text } isLoading={ isLoading }/>;
    }
  }
};

export default React.memo(TacOperationStatus);
