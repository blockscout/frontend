// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import SocketNewItemsNotice from 'src/api/socket/SocketNewItemsNotice';

import useGradualIncrement from 'src/shared/numbers/useGradualIncrement';

import { LATEST_TXS_TABLE_MIN_WIDTH } from './LatestTxsItem';

interface Props {
  overflow: number;
  url: string;
  isLoading: boolean;
}

const LatestTxsDegradedNewItems = ({ overflow, url, isLoading }: Props) => {
  const [ num, setNum ] = useGradualIncrement(0);

  React.useEffect(() => {
    if (!isLoading && overflow > 0) {
      setNum(overflow);
    }
  }, [ isLoading, overflow, setNum ]);

  return (
    <SocketNewItemsNotice
      borderBottomRadius={ 0 }
      minW={ LATEST_TXS_TABLE_MIN_WIDTH }
      num={ num }
      url={ url }
      showErrorAlert={ false }
      isLoading={ isLoading }
    />
  );
};

export default React.memo(LatestTxsDegradedNewItems);
