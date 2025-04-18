import { useRouter } from 'next/router';
import React from 'react';

import TestnetWarning from 'ui/shared/alerts/TestnetWarning';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import TxInfo from './details/TxInfo';
import type { TxQuery } from './useTxQuery';

interface Props {
  txQuery: TxQuery;
}

const TxDetails = ({ txQuery }: Props) => {
  const [ isLoading, setIsLoading ] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    if (router.query.tab === 'verification' || router.query.tab === 'issuance') {
      if (txQuery.data?.SchemaID || txQuery.data?.credential_id) {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    }
  }, [ router, txQuery, txQuery.data?.credential_status ]);

  if (txQuery.isError) {
    return <DataFetchAlert/>;
  }

  return (
    <>
      <TestnetWarning mb={ 6 } isLoading={ txQuery.isPlaceholderData }/>
      <TxInfo
        data={ txQuery.data }
        isLoading={ router.query.tab === 'verification' || router.query.tab === 'issuance' ? isLoading : txQuery.isPlaceholderData }
        socketStatus={ txQuery.socketStatus }/>
    </>
  );
};

export default React.memo(TxDetails);
