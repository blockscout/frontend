import React from 'react';

import type { OnOpenChangeHandler } from 'toolkit/hooks/useDisclosure';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import { isBrowser } from 'toolkit/utils/isBrowser';

import type { StorageItem } from './storage';
import * as storage from './storage';

interface CsvExportContextProviderProps {
  children: React.ReactNode;
}

export interface TCsvExportContext {
  dialogOpen: boolean;
  onDialogOpenChange: OnOpenChangeHandler;
  items: Array<StorageItem>;
  addItems: (items: Array<StorageItem>) => void;
}

export const CsvExportContext = React.createContext<TCsvExportContext | null>(null);

export function CsvExportContextProvider({ children }: CsvExportContextProviderProps) {
  const dialog = useDisclosure();
  const [ items, setItems ] = React.useState<Array<StorageItem>>(isBrowser() ? storage.getItems() : []);

  const addItems = React.useCallback((items: Array<StorageItem>) => {
    setItems(items);
    storage.addItems(items);
  }, [ setItems ]);

  const value = React.useMemo(() => {
    return {
      dialogOpen: dialog.open,
      onDialogOpenChange: dialog.onOpenChange,
      items,
      addItems,
    };
  }, [ dialog.open, dialog.onOpenChange, items, addItems ]);

  return (
    <CsvExportContext.Provider value={ value }>
      { children }
    </CsvExportContext.Provider>
  );
}

export function useCsvExportContext() {
  const context = React.useContext(CsvExportContext);
  if (!context) {
    throw new Error('useCsvExportContext must be used within a CsvExportContextProvider');
  }
  return context;
}
