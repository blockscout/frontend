// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import { TX } from 'src/slices/tx/stubs/tx';

import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';

import TxAdditionalInfoContent from './TxAdditionalInfoContent';

interface Props {
  hash: string;
}

const TxAdditionalInfoContainer = ({ hash }: Props) => {
  const { data, isError, isPlaceholderData } = useApiQuery('core:tx', {
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
    return <ApiFetchAlert/>;
  }

  return <TxAdditionalInfoContent tx={ data } isLoading={ isPlaceholderData }/>;
};

export default React.memo(TxAdditionalInfoContainer);
