// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import { ADDRESS_FORMATS, type AddressFormat } from 'src/slices/address/types/config';

import { useAppContext } from 'src/shell/app/context';

import * as cookies from 'src/shared/storage/cookies';

import type { TimeFormat } from './time-format/utils';

interface SettingsProviderProps {
  children: React.ReactNode;
}

interface TSettingsContext {
  addressFormat: AddressFormat;
  toggleAddressFormat: () => void;
  timeFormat: TimeFormat;
  toggleTimeFormat: () => void;
  isLocalTime: boolean;
  toggleIsLocalTime: () => void;
}

export const SettingsContext = React.createContext<TSettingsContext | null>(null);

export function SettingsContextProvider({ children }: SettingsProviderProps) {
  const { cookies: appCookies } = useAppContext();
  const initialAddressFormat = cookies.get(cookies.NAMES.ADDRESS_FORMAT, appCookies);

  const [ addressFormat, setAddressFormat ] = React.useState<AddressFormat>(
    initialAddressFormat && ADDRESS_FORMATS.includes(initialAddressFormat as AddressFormat) ? initialAddressFormat as AddressFormat : 'base16',
  );

  const [ timeFormat, setTimeFormat ] = React.useState<TimeFormat>(
    cookies.get(cookies.NAMES.TIME_FORMAT, appCookies) as TimeFormat || 'relative',
  );

  const [ isLocalTime, setIsLocalTime ] = React.useState<boolean>(
    (cookies.get(cookies.NAMES.LOCAL_TIME, appCookies) ?? 'true') === 'true',
  );

  const toggleAddressFormat = React.useCallback(() => {
    const nextValue = addressFormat === 'base16' ? 'bech32' : 'base16';
    cookies.set(cookies.NAMES.ADDRESS_FORMAT, nextValue);
    setAddressFormat(nextValue);
  }, [ addressFormat ]);

  const toggleTimeFormat = React.useCallback(() => {
    const nextValue = timeFormat === 'relative' ? 'absolute' : 'relative';
    cookies.set(cookies.NAMES.TIME_FORMAT, nextValue);
    setTimeFormat(nextValue);
  }, [ timeFormat ]);

  const toggleIsLocalTime = React.useCallback(() => {
    const nextValue = !isLocalTime;
    cookies.set(cookies.NAMES.LOCAL_TIME, nextValue ? 'true' : 'false');
    setIsLocalTime(nextValue);
  }, [ isLocalTime ]);

  const value = React.useMemo(() => {
    return {
      addressFormat,
      toggleAddressFormat,
      timeFormat,
      toggleTimeFormat,
      isLocalTime,
      toggleIsLocalTime,
    };
  }, [ addressFormat, toggleAddressFormat, timeFormat, toggleTimeFormat, isLocalTime, toggleIsLocalTime ]);

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
