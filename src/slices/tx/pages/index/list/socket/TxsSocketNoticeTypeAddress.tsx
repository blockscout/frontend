// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import * as SocketNewItemsNotice from 'src/api/socket/SocketNewItemsNotice';

import useTxsSocketTypeAddress from 'src/slices/tx/hooks/useTxsSocketTypeAddress';

interface Props {
  isLoading?: boolean;
}

const TxsSocketNoticeTypeAddress = ({ isLoading }: Props) => {
  const { num, showErrorAlert } = useTxsSocketTypeAddress({ isLoading });

  if (num === undefined) {
    return null;
  }

  return (
    <SocketNewItemsNotice.Desktop
      showErrorAlert={ showErrorAlert }
      num={ num }
      isLoading={ isLoading }
    />
  );
};

export default React.memo(TxsSocketNoticeTypeAddress);
