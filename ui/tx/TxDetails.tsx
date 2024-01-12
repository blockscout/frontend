import React from 'react';

import DataFetchAlert from 'ui/shared/DataFetchAlert';
import TxInfo from 'ui/tx/details/TxInfo';
import useFetchTxInfo from 'ui/tx/useFetchTxInfo';

const TxDetails = () => {
  const { data, isPlaceholderData, isError, socketStatus, error } = useFetchTxInfo();

  // TODO @tom2drum move error handling to the parent component
  if (isError) {
    if (error?.status === 422) {
      throw Error('Invalid tx hash', { cause: error as unknown as Error });
    }

    if (error?.status === 404) {
      throw Error('Tx not found', { cause: error as unknown as Error });
    }

    return <DataFetchAlert/>;
  }

  return <TxInfo data={ data } isLoading={ isPlaceholderData } socketStatus={ socketStatus }/>;
};

export default TxDetails;
