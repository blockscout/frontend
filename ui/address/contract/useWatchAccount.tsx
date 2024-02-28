import { watchAccount, getAccount } from '@wagmi/core';
import React from 'react';

export function getWalletAccount() {
  try {
    return getAccount();
  } catch (error) {
    return null;
  }
}

export default function useWatchAccount() {
  const [ account, setAccount ] = React.useState(getWalletAccount());

  React.useEffect(() => {
    if (!account) {
      return;
    }

    return watchAccount(setAccount);
  }, [ account ]);

  return account;
}
