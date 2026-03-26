import { mapValues } from 'es-toolkit';
import React from 'react';

import type { CsvExportType } from '../types/client';
import type { FormFields } from './dialog/types';
import type { NextJsQueryParam } from 'lib/router/types';
import type { ClusterChainConfig } from 'types/multichain';

import config from 'configs/app';
import buildUrl from 'lib/api/buildUrl';
import isNeedProxy from 'lib/api/isNeedProxy';
import type { ResourceName, ResourcePathParams } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import { useMultichainContext } from 'lib/contexts/multichain';
import dayjs from 'lib/date/dayjs';
import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import getQueryParamString from 'lib/router/getQueryParamString';
import type { IconButtonProps } from 'toolkit/chakra/icon-button';
import { IconButton } from 'toolkit/chakra/icon-button';
import { toaster } from 'toolkit/chakra/toaster';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import { downloadBlob } from 'toolkit/utils/file';
import IconSvg from 'ui/shared/IconSvg';
import ReCaptcha from 'ui/shared/reCaptcha/ReCaptcha';
import useReCaptcha from 'ui/shared/reCaptcha/useReCaptcha';

import getFileName from '../utils/getFileName';
import CsvExportDialog from './dialog/CsvExportDialog';
import CsvExportDialogDescription from './dialog/CsvExportDialogDescription';

interface Props<R extends ResourceName> extends Omit<IconButtonProps, 'type'> {
  type: CsvExportType;
  resourceName: R;
  pathParams: ResourcePathParams<R>;
  queryParams?: Record<string, NextJsQueryParam>;
  extraParams?: Record<string, string>;
  chainData?: ClusterChainConfig;
  loadingInitial?: boolean;
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
  ...rest
}: Props<R>) => {

  const abortControllerRef = React.useRef<AbortController | null>(null);

  const isInitialLoading = useIsInitialLoading(loadingInitial);
  const multichainContext = useMultichainContext();
  const dialog = useDisclosure();
  const recaptcha = useReCaptcha();

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
      ...mapValues(queryParams || {}, (value) => getQueryParamString(value)),
      ...extraParams,
    };
  }, [ pathParams, queryParams, extraParams ]);

  const fetchFactorySync = React.useCallback((data?: FormFields) => {
    return async(recaptchaToken?: string) => {
      const url = buildUrl(resourceName, pathParams, {
        ...mapValues(data || {}, (value) => dayjs(value).toISOString()),
        ...queryParams,
      }, undefined, multichainContext?.chain);

      const response = await fetch(url, {
        headers: {
          'content-type': 'application/octet-stream',
          ...(recaptchaToken && { 'recaptcha-v2-response': recaptchaToken }),
          ...(isNeedProxy() && multichainContext?.chain ? { 'x-endpoint': multichainContext.chain.app_config.apis.general?.endpoint } : {}),
        },
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
  }, [ resourceName, pathParams, queryParams, multichainContext?.chain ]);

  const downloadFileSync = React.useCallback(async(data?: FormFields) => {
    try {
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
      // TODO @tom2drum handle 409 error
      toaster.error({
        title: 'Error',
        description: (error as Error)?.message || 'Something went wrong. Try again later.',
      });
    }
  }, [ chainConfig, fetchFactorySync, mergedParams, recaptcha, type ]);

  const handleButtonClick = React.useCallback(() => {
    dialog.onOpen();
  }, [ dialog ]);

  const handleFormSubmit = React.useCallback(async(data: FormFields) => {
    const isSuccess = await downloadFileSync(data);
    if (isSuccess) {
      dialog.onClose();
    }
  }, [ downloadFileSync, dialog ]);

  const handleDownloadCancel = React.useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  }, [ ]);

  if (!chainConfig.features.csvExport.isEnabled) {
    return null;
  }

  return (
    <>
      <IconButton
        size="md"
        variant="icon_background"
        aria-label="Download CSV"
        loadingSkeleton={ isInitialLoading || loadingSkeleton }
        onClick={ handleButtonClick }
        { ...rest }
      >
        <IconSvg name="files/csv" boxSize={ 5 }/>
      </IconButton>
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
      <ReCaptcha { ...recaptcha }/>
    </>
  );
};

export default React.memo(CsvExport);
