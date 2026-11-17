// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TxsSocketType } from 'src/slices/tx/types/socket';

import TxsSocketNoticeTypeAddress from './TxsSocketNoticeTypeAddress';
import TxsSocketNoticeTypeAll from './TxsSocketNoticeTypeAll';

interface Props {
  type: TxsSocketType;
  isLoading?: boolean;
}

const TxsSocketNotice = ({ type, isLoading }: Props) => {
  switch (type) {
    case 'txs_home':
    case 'txs_validated':
    case 'txs_pending': {
      return <TxsSocketNoticeTypeAll type={ type } isLoading={ isLoading }/>;
    }
    case 'address_txs': {
      return <TxsSocketNoticeTypeAddress isLoading={ isLoading }/>;
    }

    default:
      return null;
  }
};

export default React.memo(TxsSocketNotice);
