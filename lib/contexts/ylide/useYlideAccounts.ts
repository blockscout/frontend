import { WalletAccount } from '@ylide/sdk';
import { useState, useCallback } from 'react';

import type { YlideSavedAccount } from './types';

const serializeAccounts = (accounts: Array<YlideSavedAccount>) => {
  return JSON.stringify(accounts.map(acc => ({
    name: acc.name,
    account: acc.account.toBase64(),
    wallet: acc.wallet,
    backendAuthKey: acc.backendAuthKey,
  })));
};

const deserializeAccounts = (serialized: string) => {
  const parsed = JSON.parse(serialized) as Array<{ name: string; account: string; wallet: string; backendAuthKey: string | null }>;
  if (!Array.isArray(parsed)) {
    return [];
  } else {
    return parsed.map((acc) => ({
      ...acc,
      backendAuthKey: acc.backendAuthKey || null,
      account: WalletAccount.fromBase64(acc.account),
    }));
  }
};

export const useYlideAccounts = () => {
  const localStorage = typeof window === 'undefined' ? undefined : window?.localStorage;

  const loadAccountsFromBrowserStorage = useCallback(() => {
    const savedAccounts = localStorage?.getItem('ylide-accounts');
    if (savedAccounts) {
      return deserializeAccounts(savedAccounts);
    }
    return [];
  }, [ localStorage ]);

  const [ savedAccounts, setAccounts ] = useState<Array<YlideSavedAccount>>(loadAccountsFromBrowserStorage());

  const addAccount = useCallback((name: string, account: WalletAccount, wallet: string, backendAuthKey: string | null) => {
    const newSavedAccount = { name, account, wallet, backendAuthKey };
    const newAccounts = [ ...savedAccounts, newSavedAccount ];
    localStorage?.setItem('ylide-accounts', serializeAccounts(newAccounts));
    setAccounts(newAccounts);
    return newSavedAccount;
  }, [ savedAccounts, localStorage ]);

  const deleteAccount = useCallback((account: WalletAccount) => {
    const newAccounts = savedAccounts.filter((acc) => acc.account.address !== account.address);
    localStorage?.setItem('ylide-accounts', serializeAccounts(newAccounts));
    setAccounts(newAccounts);
  }, [ savedAccounts, localStorage ]);

  const setAccountAuthKey = useCallback((account: WalletAccount, authKey: string | null) => {
    const actualAccounts = loadAccountsFromBrowserStorage();
    const newAccounts = actualAccounts.map((acc) => {
      if (acc.account.address === account.address) {
        return {
          ...acc,
          backendAuthKey: authKey,
        };
      }
      return acc;
    });
    localStorage?.setItem('ylide-accounts', serializeAccounts(newAccounts));
    setAccounts(newAccounts);
  }, [ loadAccountsFromBrowserStorage, localStorage ]);

  return { savedAccounts, addAccount, deleteAccount, setAccountAuthKey };
};
