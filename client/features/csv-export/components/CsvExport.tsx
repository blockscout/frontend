// SPDX-License-Identifier: LicenseRef-Blockscout

import type { JsxStyleProps } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import { delay, mapValues, pickBy } from 'es-toolkit';
import React from 'react';

import type { CsvExportDownloadResponse } from '../types/api';
import type { CsvExportType } from '../types/client';
import type { FormFields } from './dialog/types';
import type { NextJsQueryParam } from 'client/shared/router/types';
import type { ClusterChainConfig } from 'types/multichain';

import buildUrl from 'client/api/build-url';
import useApiFetch from 'client/api/hooks/useApiFetch';
import useApiQuery from 'client/api/hooks/useApiQuery';
import isNeedProxy from 'client/api/is-need-proxy';
import type { ResourceName, ResourcePathParams } from 'client/api/resources';

import getErrorMessage from 'client/shared/errors/get-error-message';
import getErrorObjStatusCode from 'client/shared/errors/get-error-obj-status-code';
import useIsInitialLoading from 'client/shared/hooks/useIsInitialLoading';
import getQueryParamString from 'client/shared/router/get-query-param-string';

import config from 'configs/app';
import { useMultichainContext } from 'lib/contexts/multichain';
import dayjs from 'lib/date/dayjs';
import { IconButton } from 'toolkit/chakra/icon-button';
import { toaster } from 'toolkit/chakra/toaster';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import { downloadBlob } from 'toolkit/utils/file';
import IconSvg from 'ui/shared/IconSvg';
import ReCaptcha from 'ui/shared/reCaptcha/ReCaptcha';
import useReCaptcha from 'ui/shared/reCaptcha/useReCaptcha';

import { useCsvExportContext } from '../utils/context';
import getFileName from '../utils/get-file-name';
import type { StorageItem } from '../utils/storage';
import CsvExportDialog from './dialog/CsvExportDialog';
import CsvExportDialogDescription from './dialog/CsvExportDialogDescription';

interface Props<R extends ResourceName> extends JsxStyleProps {
  type: CsvExportType;
  resourceName: R;
  pathParams?: ResourcePathParams<R>;
  queryParams?: Record<string, NextJsQueryParam | null>;
  extraParams?: Record<string, string>;
  chainData?: ClusterChainConfig;
  loadingInitial?: boolean;
  loadingSkeleton?: boolean;
  periodFilter?: boolean;
}

const CsvExport = <R extends ResourceName>({
  chainData,
  loadingInitial,
  loadingSkeleton,
  type,
  resourceName,
  pathParams,
  queryParams,
  extraParams,
  periodFilter = true,
  ...rest
}: Props<R>) => {

  const [ isPending, setIsPending ] = React.useState(false);

  const abortControllerRef = React.useRef<AbortController | null>(null);

  const isInitialLoading = useIsInitialLoading(loadingInitial);
  const multichainContext = useMultichainContext();
  const dialog = useDisclosure();
  const recaptcha = useReCaptcha();
  const csvExportContext = useCsvExportContext();
  const apiFetch = useApiFetch();

  const chain = chainData || multichainContext?.chain;

  const configQuery = useApiQuery('general:config_csv_export', {
    queryOptions: {
      refetchOnMount: false,
    },
    chain,
  });

  const chainConfig = chain?.app_config || config;
  const recordsLimit = configQuery.data?.limit || 10_000;
  const isAsyncDownload = configQuery.data?.async_enabled;

  const mergedParams: Record<string, string> = React.useMemo(() => {
    return {
      ...pathParams,
      ...mapValues(queryParams || {}, (value) => getQueryParamString(value ?? undefined)),
      ...extraParams,
    };
  }, [ pathParams, queryParams, extraParams ]);

  const fetchFactorySync = React.useCallback((data?: FormFields) => {
    return async(recaptchaToken?: string) => {
      const url = buildUrl(resourceName, pathParams, {
        ...mapValues(data || {}, (value) => dayjs(value).toISOString()),
        ...queryParams,
      }, undefined, chain);

      abortControllerRef.current = new AbortController();

      const response = await fetch(url, {
        headers: {
          'content-type': 'application/octet-stream',
          ...(recaptchaToken && { 'recaptcha-v2-response': recaptchaToken }),
          ...(isNeedProxy() && chain ? { 'x-endpoint': chain.app_config.apis.general?.endpoint } : {}),
        },
        signal: abortControllerRef.current?.signal,
      });

      if (!response.ok) {
        throw new Error(response.statusText, {
          cause: {
            status: response.status,
          },
        });
      }

      return response;
    };
  }, [ resourceName, pathParams, queryParams, chain ]);

  const fetchFactoryAsync = React.useCallback((data?: FormFields) => {
    return async(recaptchaToken?: string) => {
      abortControllerRef.current = new AbortController();

      return apiFetch<typeof resourceName>(resourceName, {
        pathParams,
        queryParams: {
          ...mapValues(data || {}, (value) => dayjs(value).toISOString()),
          ...queryParams,
        },
        chain,
        fetchParams: {
          headers: {
            ...(recaptchaToken && { 'recaptcha-v2-response': recaptchaToken }),
          },
          signal: abortControllerRef.current?.signal,
        },
      }) as Promise<CsvExportDownloadResponse>;
    };
  }, [ apiFetch, chain, pathParams, queryParams, resourceName ]);

  const downloadFileSync = React.useCallback(async(data?: FormFields) => {
    try {
      setIsPending(true);
      const response = await recaptcha.fetchProtectedResource<Response>(fetchFactorySync(data));
      const blob = await response.blob();
      downloadBlob(
        blob,
        getFileName({
          type,
          params: { ...mergedParams, ...data },
          chainConfig,
        }),
      );
      return true;
    } catch (error) {
      toaster.error({
        title: 'Error',
        description: (error as Error)?.message || 'Something went wrong. Try again later.',
      });
    } finally {
      setIsPending(false);
    }
  }, [ chainConfig, fetchFactorySync, mergedParams, recaptcha, type ]);

  const downloadFileAsync = React.useCallback(async(data?: FormFields) => {
    try {
      setIsPending(true);
      const downloadResponse = await recaptcha.fetchProtectedResource<CsvExportDownloadResponse>(fetchFactoryAsync(data));

      if (downloadResponse && 'request_id' in downloadResponse) {
        const newItem: StorageItem = {
          request_id: downloadResponse.request_id,
          file_id: null,
          expires_at: null,
          status: 'pending',
          type,
          params: pickBy({
            ...mapValues(data || {}, (value) => dayjs(value).toISOString()),
            ...mergedParams,
            chain_id: chain?.id,
          }, (value) => value !== '' && value !== undefined && value !== null),
          is_highlighted: false,
        };

        csvExportContext.addItems([ newItem ]);
        // we have to wait a little bit to let new item to be added to the list before opening the popup
        await delay(200);
        csvExportContext.onDialogOpenChange({ open: true });
        return true;
      }

      throw new Error('Something went wrong. Try again later.');
    } catch (error) {
      const statusCode = getErrorObjStatusCode(error);
      if (statusCode === 409) {
        toaster.warning({
          description: 'You cannot start a new export, please wait until the current exports finish.',
        });
        return;
      }

      toaster.error({
        title: 'Error',
        description: getErrorMessage(error) || 'Something went wrong. Try again later.',
      });
    } finally {
      setIsPending(false);
    }
  }, [ chain, csvExportContext, fetchFactoryAsync, mergedParams, recaptcha, type ]);

  const handleButtonClick = React.useCallback(() => {
    if (periodFilter) {
      dialog.onOpen();
    } else {
      const downloadFn = isAsyncDownload ? downloadFileAsync : downloadFileSync;
      downloadFn();
    }
  }, [ isAsyncDownload, periodFilter, dialog, downloadFileAsync, downloadFileSync ]);

  const handleFormSubmit = React.useCallback(async(data: FormFields) => {
    const downloadFn = isAsyncDownload ? downloadFileAsync : downloadFileSync;
    const isSuccess = await downloadFn(data);
    if (isSuccess) {
      dialog.onClose();
    }
  }, [ isAsyncDownload, downloadFileAsync, downloadFileSync, dialog ]);

  const handleDownloadCancel = React.useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  }, [ ]);

  if (!chainConfig.features.csvExport.isEnabled) {
    return null;
  }

  return (
    <Box { ...rest }>
      <Tooltip
        content="This feature is not available due to a reCAPTCHA initialization error. Please contact the project team on Discord to report this issue."
        disabled={ !recaptcha.isInitError }
      >
        <IconButton
          size="md"
          variant="dropdown"
          aria-label="Download CSV"
          loading={ isPending }
          loadingSkeleton={ isInitialLoading || loadingSkeleton || configQuery.isPending }
          onClick={ handleButtonClick }
          disabled={ recaptcha.isInitError }
        >
          <IconSvg name="files/csv"/>
        </IconButton>
      </Tooltip>
      <CsvExportDialog
        open={ dialog.open }
        onOpenChange={ dialog.onOpenChange }
        onFormSubmit={ handleFormSubmit }
        onCancel={ handleDownloadCancel }
        isAsyncDownload={ isAsyncDownload }
      >
        <CsvExportDialogDescription
          type={ type }
          params={ mergedParams }
          chainInfo={ chain }
          recordsLimit={ recordsLimit }
        />
      </CsvExportDialog>
      <ReCaptcha { ...recaptcha } hideWarning/>
    </Box>
  );
};

export default React.memo(CsvExport);
