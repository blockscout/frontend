// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TxsSocketNoticePlace } from 'src/slices/tx/types/socket';

import * as SocketNewItemsNotice from 'src/api/socket/SocketNewItemsNotice';

import useTxsSocketTypeAddress from 'src/slices/tx/hooks/useTxsSocketTypeAddress';

interface Props {
  place: TxsSocketNoticePlace;
  isLoading?: boolean;
}

const TxsSocketNoticeTypeAddress = ({ place, isLoading }: Props) => {
  const { num, showErrorAlert } = useTxsSocketTypeAddress({ isLoading });

  if (num === undefined) {
    return null;
  }

  if (place === 'table') {
    return (
      <SocketNewItemsNotice.Desktop
        showErrorAlert={ showErrorAlert }
        num={ num }
        isLoading={ isLoading }
      />
    );
  }

  if (place === 'list') {
    return (
      <SocketNewItemsNotice.Mobile
        num={ num }
        showErrorAlert={ showErrorAlert }
        isLoading={ isLoading }
      />
    );
  }
};

export default React.memo(TxsSocketNoticeTypeAddress);
