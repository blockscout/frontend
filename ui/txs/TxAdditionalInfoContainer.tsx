import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { TX } from 'stubs/tx';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import TxAdditionalInfoContent from './TxAdditionalInfoContent';

interface Props {
  hash: string;
}

const TxAdditionalInfoContainer = ({ hash }: Props) => {
  const { data, isError, isPlaceholderData } = useApiQuery('general:tx', {
    pathParams: { hash },
    queryOptions: {
      refetchOnMount: false,
      placeholderData: TX,
    },
  });

  if (!data) {
    return <span>No data</span>;
  }

  if (isError) {
    return <DataFetchAlert/>;
  }

  return <TxAdditionalInfoContent tx={ data } isLoading={ isPlaceholderData }/>;
};

export default React.memo(TxAdditionalInfoContainer);
