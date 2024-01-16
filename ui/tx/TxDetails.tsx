import React from 'react';

import TxInfo from 'ui/tx/details/TxInfo';
import useFetchTxInfo from 'ui/tx/useFetchTxInfo';

const TxDetails = () => {
  const { data, isPlaceholderData, socketStatus } = useFetchTxInfo();

  return <TxInfo data={ data } isLoading={ isPlaceholderData } socketStatus={ socketStatus }/>;
};

export default TxDetails;
