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

export default React.memo(TxsSocketNoticeTypeAddress);
