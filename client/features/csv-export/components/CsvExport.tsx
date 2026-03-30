import type { JsxStyleProps } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import { mapValues } from 'es-toolkit';
import React from 'react';

import type { CsvExportDownloadResponse } from '../types/api';
import type { CsvExportType } from '../types/client';
import type { FormFields } from './dialog/types';
import type { NextJsQueryParam } from 'lib/router/types';
import type { ClusterChainConfig } from 'types/multichain';

import config from 'configs/app';
import buildUrl from 'lib/api/buildUrl';
import isNeedProxy from 'lib/api/isNeedProxy';
import type { ResourceName, ResourcePathParams } from 'lib/api/resources';
import useApiFetch from 'lib/api/useApiFetch';
import useApiQuery from 'lib/api/useApiQuery';
import { useMultichainContext } from 'lib/contexts/multichain';
import dayjs from 'lib/date/dayjs';
import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import getQueryParamString from 'lib/router/getQueryParamString';
import { IconButton } from 'toolkit/chakra/icon-button';
import { toaster } from 'toolkit/chakra/toaster';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import { downloadBlob } from 'toolkit/utils/file';
import IconSvg from 'ui/shared/IconSvg';
import ReCaptcha from 'ui/shared/reCaptcha/ReCaptcha';
import useReCaptcha from 'ui/shared/reCaptcha/useReCaptcha';

import { useCsvExportContext } from '../utils/context';
import getFileName from '../utils/getFileName';
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

  const configQuery = useApiQuery('general:config_csv_export', {
    queryOptions: {
      refetchOnMount: false,
    },
  });

  const chainConfig = chainData?.app_config || multichainContext?.chain.app_config || config;
  const recordsLimit = configQuery.data?.limit || 10_000;

  const mergedParams: Record<string, string> = React.useMemo(() => {
    return {
      ...pathParams,
      ...mapValues(queryParams || {}, (value) => getQueryParamString(value ?? undefined)),
      ...extraParams,
    };
  }, [ pathParams, queryParams, extraParams ]);

  const fetchFactorySync = React.useCallback((data?: FormFields) => {
    return async(recaptchaToken?: string) => {
      const chain = chainData || multichainContext?.chain;
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
  }, [ resourceName, pathParams, queryParams, chainData, multichainContext?.chain ]);

  const fetchFactoryAsync = React.useCallback((data?: FormFields) => {
    return async(recaptchaToken?: string) => {
      const chain = chainData || multichainContext?.chain;
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
  }, [ apiFetch, chainData, multichainContext?.chain, pathParams, queryParams, resourceName ]);

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
      if ('request_id' in downloadResponse) {
        const newItem: StorageItem = {
          id: downloadResponse.request_id,
          expires_at: null,
          status: 'pending',
          type,
          params: {
            ...mapValues(data || {}, (value) => dayjs(value).toISOString()),
            ...mergedParams,
          },
        };
        csvExportContext.addItems([ newItem ]);
        csvExportContext.onDialogOpenChange({ open: true });
        return true;
      }

      throw new Error('Something went wrong. Try again later.');
    } catch (error) {
      // TODO @tom2drum handle 409 error
      toaster.error({
        title: 'Error',
        description: (error as Error)?.message || 'Something went wrong. Try again later.',
      });
    } finally {
      setIsPending(false);
    }
  }, [ csvExportContext, fetchFactoryAsync, mergedParams, recaptcha, type ]);

  const handleButtonClick = React.useCallback(() => {
    if (periodFilter) {
      dialog.onOpen();
    } else {
      const downloadFn = configQuery.data?.async_enabled ? downloadFileAsync : downloadFileSync;
      downloadFn();
    }
  }, [ configQuery.data?.async_enabled, periodFilter, dialog, downloadFileAsync, downloadFileSync ]);

  const handleFormSubmit = React.useCallback(async(data: FormFields) => {
    const downloadFn = configQuery.data?.async_enabled ? downloadFileAsync : downloadFileSync;
    const isSuccess = await downloadFn(data);
    if (isSuccess) {
      dialog.onClose();
    }
  }, [ configQuery.data?.async_enabled, downloadFileAsync, downloadFileSync, dialog ]);

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
          variant="icon_background"
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
      >
        <CsvExportDialogDescription
          type={ type }
          params={ mergedParams }
          chainInfo={ chainData }
          recordsLimit={ recordsLimit }
        />
      </CsvExportDialog>
      <ReCaptcha { ...recaptcha } hideWarning/>
    </Box>
  );
};

export default React.memo(CsvExport);
