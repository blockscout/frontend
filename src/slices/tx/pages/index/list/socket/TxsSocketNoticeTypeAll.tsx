// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TxsSocketNoticePlace, TxsSocketType } from 'src/slices/tx/types/socket';

import * as SocketNewItemsNotice from 'src/api/socket/SocketNewItemsNotice';

import useNewTxsSocketTypeAll from 'src/slices/tx/hooks/useTxsSocketTypeAll';

import { useMultichainContext } from 'src/features/multichain/context';

import { route } from 'src/shared/router/routes';

interface Props {
  type: TxsSocketType;
  place: TxsSocketNoticePlace;
  isLoading?: boolean;
}

const TxsSocketNoticeTypeAll = ({ type, place, isLoading }: Props) => {
  const multichainContext = useMultichainContext();
  const { num, showErrorAlert } = useNewTxsSocketTypeAll({ type, isLoading });

  if (num === undefined) {
    return null;
  }

  const url = (() => {
    if (type === 'txs_home' && multichainContext) {
      return route({ pathname: '/txs', query: { tab: 'txs_local', chain_id: multichainContext.chain.id } });
    }
  })();

  if (place === 'table') {
    return (
      <SocketNewItemsNotice.Desktop
        showErrorAlert={ showErrorAlert }
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
        showErrorAlert={ showErrorAlert }
        isLoading={ isLoading }
        url={ url }
      />
    );
  }
};

export default React.memo(TxsSocketNoticeTypeAll);
