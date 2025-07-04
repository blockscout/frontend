import React from 'react';

import type { TxsSocketNoticePlace, TxsSocketType } from './types';

import { route } from 'nextjs/routes';

import { useMultichainContext } from 'lib/contexts/multichain';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

import useNewTxsSocketTypeAll from './useTxsSocketTypeAll';

interface Props {
  type: TxsSocketType;
  place: TxsSocketNoticePlace;
  isLoading?: boolean;
}

const TxsSocketNoticeTypeAll = ({ type, place, isLoading }: Props) => {
  const multichainContext = useMultichainContext();
  const { num, alertText } = useNewTxsSocketTypeAll({ type, isLoading });

  if (num === undefined) {
    return null;
  }

  const url = (() => {
    if (type === 'txs_home_cross_chain') {
      return route({ pathname: '/txs' });
    }

    if (type === 'txs_home' && multichainContext) {
      return route({ pathname: '/txs' }, multichainContext);
    }
  })();

  if (place === 'table') {
    return (
      <SocketNewItemsNotice.Desktop
        alert={ alertText }
        num={ num }
        isLoading={ isLoading }
        url={ url }
      />
    );
  }

  if (place === 'list') {
    return (
      <SocketNewItemsNotice.Mobile
        num={ num }
        alert={ alertText }
        isLoading={ isLoading }
        url={ url }
      />
    );
  }
};

export default React.memo(TxsSocketNoticeTypeAll);
