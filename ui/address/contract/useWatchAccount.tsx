import { watchAccount, getAccount } from '@wagmi/core';
import React from 'react';
import type { Config } from 'wagmi';
import { useConfig } from 'wagmi';

export function getWalletAccount(config: Config) {
  try {
    return getAccount(config);
  } catch (error) {
    return null;
  }
}

export default function useWatchAccount() {
  const config = useConfig();
  const [ account, setAccount ] = React.useState(getWalletAccount(config));

  React.useEffect(() => {
    if (!account) {
      return;
    }

    return watchAccount(config, {
      onChange(account) {
        setAccount(account);
      },
    });
  }, [ account, config ]);

  return account;
}
