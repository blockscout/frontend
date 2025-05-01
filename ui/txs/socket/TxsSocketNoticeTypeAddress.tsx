import React from 'react';

import type { TxsSocketNoticePlace } from './types';

import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

import useTxsSocketTypeAddress from './useTxsSocketTypeAddress';

interface Props {
  place: TxsSocketNoticePlace;
  isLoading?: boolean;
}

const TxsSocketNoticeTypeAddress = ({ place, isLoading }: Props) => {
  const { num, alertText } = useTxsSocketTypeAddress({ isLoading });

  if (num === undefined) {
    return null;
  }

  if (place === 'table') {
    return (
      <SocketNewItemsNotice.Desktop
        url={ window.location.href }
        alert={ alertText }
        num={ num }
        isLoading={ isLoading }
      />
    );
  }

  if (place === 'list') {
    return (
      <SocketNewItemsNotice.Mobile
        url={ window.location.href }
        num={ num }
        alert={ alertText }
        isLoading={ isLoading }
      />
    );
  }
};

export default React.memo(TxsSocketNoticeTypeAddress);
