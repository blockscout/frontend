// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TxsSocketNoticePlace } from 'client/slices/tx/types/socket';

import useTxsSocketTypeAddress from 'client/slices/tx/hooks/useTxsSocketTypeAddress';

import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

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
