// SPDX-License-Identifier: LicenseRef-Blockscout

import dynamic from 'next/dynamic';
import React from 'react';

import type { SettingsModalTabId } from './registry';

const SettingsModal = dynamic(() => import('./SettingsModal'), { ssr: false });

type SettingsModalState =
  | { isOpen: false } |
  { isOpen: true; targetTab: SettingsModalTabId | undefined };

interface TSettingsModalContext {
  state: SettingsModalState;
  open: (targetTab?: SettingsModalTabId) => void;
  close: () => void;
}

const CLOSED: SettingsModalState = { isOpen: false };

const SettingsModalContext = React.createContext<TSettingsModalContext | null>(null);

interface Props {
  children: React.ReactNode;
}

export function SettingsModalContextProvider({ children }: Props) {
  const [ state, setState ] = React.useState<SettingsModalState>(CLOSED);

  const open = React.useCallback((targetTab?: SettingsModalTabId) => {
    setState({ isOpen: true, targetTab });
  }, []);

  const close = React.useCallback(() => {
    setState(CLOSED);
  }, []);

  const value = React.useMemo(() => ({ state, open, close }), [ state, open, close ]);

  return (
    <SettingsModalContext.Provider value={ value }>
      { children }
      { state.isOpen && <SettingsModal targetTab={ state.targetTab } onClose={ close }/> }
    </SettingsModalContext.Provider>
  );
}

export function useSettingsModalContext(): TSettingsModalContext | null {
  return React.useContext(SettingsModalContext);
}
