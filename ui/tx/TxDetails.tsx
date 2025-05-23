import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type * as tac from '@blockscout/tac-operation-lifecycle-types';

import type { ResourceError } from 'lib/api/resources';
import TestnetWarning from 'ui/shared/alerts/TestnetWarning';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import TxInfo from './details/TxInfo';
import type { TxQuery } from './useTxQuery';

interface Props {
  txQuery: TxQuery;
  tacOperationQuery?: UseQueryResult<tac.OperationsFullResponse, ResourceError>;
}

const TxDetails = ({ txQuery, tacOperationQuery }: Props) => {
  if (txQuery.isError) {
    return <DataFetchAlert/>;
  }

  return (
    <>
      <TestnetWarning mb={ 6 } isLoading={ txQuery.isPlaceholderData }/>
      <TxInfo
        data={ txQuery.data }
        tacOperations={ tacOperationQuery?.data?.items }
        isLoading={ txQuery.isPlaceholderData || (tacOperationQuery?.isPlaceholderData ?? false) }
        socketStatus={ txQuery.socketStatus }
      />
    </>
  );
};

export default React.memo(TxDetails);
