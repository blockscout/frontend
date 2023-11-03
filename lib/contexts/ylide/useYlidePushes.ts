import { useState, useCallback, useMemo } from 'react';

import type { YlideAccountPushes } from './types';

const serializePushes = (accounts: Array<YlideAccountPushes>) => {
  return JSON.stringify(accounts);
};

const deserializePushes = (serialized: string) => {
  return JSON.parse(serialized) as Array<YlideAccountPushes>;
};

export const useYlidePushes = () => {
  const localStorage = typeof window === 'undefined' ? undefined : window?.localStorage;

  const loadPushesFromBrowserStorage = useCallback(() => {
    const savedPushes = localStorage?.getItem('ylide-pushes');
    if (savedPushes) {
      return deserializePushes(savedPushes);
    }
    return [];
  }, [ localStorage ]);

  const [ pushes, setPushes ] = useState<Array<YlideAccountPushes>>(loadPushesFromBrowserStorage());

  const addressesWithPushes = useMemo(() => pushes.map(p => p.lowercaseAddress), [ pushes ]);

  const setAccountPushState = useCallback((address: string, isEnabled: boolean) => {
    const actualPushes = loadPushesFromBrowserStorage();
    const newPushes = [ ...actualPushes ];
    address = address.toLowerCase();
    const acc = newPushes.find(a => a.lowercaseAddress === address);
    if (acc) {
      acc.isEnabled = isEnabled;
    } else {
      newPushes.push({ lowercaseAddress: address, isEnabled });
    }
    localStorage?.setItem('ylide-pushes', serializePushes(newPushes));
    setPushes(newPushes);
  }, [ loadPushesFromBrowserStorage, localStorage ]);

  return { addressesWithPushes, setAccountPushState };
};
