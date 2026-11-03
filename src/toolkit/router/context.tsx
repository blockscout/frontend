// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { Router, RouterContextValue, RouterLinkComponent } from './types';

import { defaultRouterContextValue } from './defaults';

export const RouterContext = React.createContext<RouterContextValue>(defaultRouterContextValue);

export interface RouterProviderProps {
  readonly value: RouterContextValue;
  readonly children: React.ReactNode;
}

export const RouterProvider = ({ value, children }: RouterProviderProps) => {
  return <RouterContext.Provider value={ value }>{ children }</RouterContext.Provider>;
};

export const useRouterContext = (): RouterContextValue => React.useContext(RouterContext);

export const useRouter = (): Router => useRouterContext().router;

export const useLink = (): RouterLinkComponent => useRouterContext().Link;
