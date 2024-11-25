import React from 'react';

import { ADDRESS_FORMATS, type AddressFormat } from 'types/views/address';

import * as cookies from 'lib/cookies';

import { useAppContext } from './app';

interface SettingsProviderProps {
  children: React.ReactNode;
}

interface TSettingsContext {
  addressFormat: AddressFormat;
  toggleAddressFormat: () => void;
}

export const SettingsContext = React.createContext<TSettingsContext | null>(null);

export function SettingsContextProvider({ children }: SettingsProviderProps) {
  const { cookies: appCookies } = useAppContext();
  const initialAddressFormat = cookies.get(cookies.NAMES.ADDRESS_FORMAT, appCookies);

  const [ addressFormat, setAddressFormat ] = React.useState<AddressFormat>(
    initialAddressFormat && ADDRESS_FORMATS.includes(initialAddressFormat as AddressFormat) ? initialAddressFormat as AddressFormat : 'base16',
  );

  const toggleAddressFormat = React.useCallback(() => {
    setAddressFormat(prev => {
      const nextValue = prev === 'base16' ? 'bech32' : 'base16';
      cookies.set(cookies.NAMES.ADDRESS_FORMAT, nextValue);
      return nextValue;
    });
  }, []);

  const value = React.useMemo(() => {
    return {
      addressFormat,
      toggleAddressFormat,
    };
  }, [ addressFormat, toggleAddressFormat ]);

  return (
    <SettingsContext.Provider value={ value }>
      { children }
    </SettingsContext.Provider>
  );
}

export function useSettingsContext(disabled?: boolean) {
  const context = React.useContext(SettingsContext);
  if (context === undefined || disabled) {
    return null;
  }
  return context;
}
