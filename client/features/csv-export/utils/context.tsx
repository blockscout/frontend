import type { UseQueryResult } from '@tanstack/react-query';
import { queryOptions, useQueries } from '@tanstack/react-query';
import React from 'react';

import type { CsvExportItemResponse } from '../types/api';

import useApiFetch from 'lib/api/useApiFetch';
import dayjs from 'lib/date/dayjs';
import getErrorObjStatusCode from 'lib/errors/getErrorObjStatusCode';
import type { OnOpenChangeHandler } from 'toolkit/hooks/useDisclosure';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import { SECOND } from 'toolkit/utils/consts';
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
  const apiFetch = useApiFetch();

  const [ items, setItems ] = React.useState<Array<StorageItem>>(isBrowser() ? storage.getItems() : []);

  const queriesOptions = React.useMemo(() => {
    return items.map((item) => (queryOptions({
      queryKey: [ 'general:csv_exports_item', item.request_id ],
      queryFn: async({ signal }) => {
        try {
          if (item.status === 'pending') {
            const response = await (apiFetch('general:csv_exports_item', {
              pathParams: { id: item.request_id },
              fetchParams: { signal },
            }) as Promise<CsvExportItemResponse>);
            if (response.status !== 'pending') {
              const newItem = {
                ...item,
                status: response.status,
                expires_at: response.expires_at,
                file_id: response.file_id,
                is_highlighted: true,
              };
              storage.updateItems([ newItem ]);
              return newItem;
            }
          }

          const isExpired = item.status !== 'expired' && item.expires_at && dayjs().isAfter(dayjs(item.expires_at));
          if (isExpired) {
            const newItem = {
              ...item,
              status: 'expired' as const,
              is_highlighted: true,
            };
            storage.updateItems([ newItem ]);
            return newItem;
          }
        } catch (error) {
          const statusCode = getErrorObjStatusCode(error);
          if (statusCode === 404) {
            const newItem = {
              ...item,
              status: 'expired' as const,
              is_highlighted: true,
            };
            storage.updateItems([ newItem ]);
            return newItem;
          }
        }

        return item;
      },
      refetchInterval: (query) => {
        const status = query.state.data?.status;
        return status === 'pending' ? 10 * SECOND : false;
      },
      refetchOnMount: false,
    })));
  }, [ items, apiFetch ]);

  const combineQueriesResult = React.useCallback((results: Array<UseQueryResult<StorageItem | undefined, Error>>) => {
    return results.map(({ data }) => data).filter(Boolean);
  }, []);

  const queriesResult = useQueries({
    queries: queriesOptions,
    combine: combineQueriesResult,
  });

  const addItems = React.useCallback((items: Array<StorageItem>) => {
    setItems((prev) => ([ ...items, ...prev ]));
    storage.addItems(items);
  }, [ ]);

  const value = React.useMemo(() => {
    return {
      dialogOpen: dialog.open,
      onDialogOpenChange: dialog.onOpenChange,
      items: queriesResult,
      addItems,
    };
  }, [ dialog.open, dialog.onOpenChange, queriesResult, addItems ]);

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
