import React from 'react';

import type { TxsSocketNoticePlace, TxsSocketType } from './types';

import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

import useNewTxsSocketTypeAll from './useTxsSocketTypeAll';

interface Props {
  type: TxsSocketType;
  place: TxsSocketNoticePlace;
  isLoading?: boolean;
}

const TxsSocketNoticeTypeAll = ({ type, place, isLoading }: Props) => {
  const { num, alertText } = useNewTxsSocketTypeAll({ type, isLoading });

  if (num === undefined) {
    return null;
  }

  if (place === 'table') {
    return (
      <SocketNewItemsNotice.Desktop
        alert={ alertText }
        num={ num }
        isLoading={ isLoading }
      />
    );
  }

  if (place === 'list') {
    return (
      <SocketNewItemsNotice.Mobile
        num={ num }
        alert={ alertText }
        isLoading={ isLoading }
      />
    );
  }
};

export default React.memo(TxsSocketNoticeTypeAll);
