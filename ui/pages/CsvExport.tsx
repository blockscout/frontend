import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { AddressFromToFilterValues } from 'types/api/address';
import type { CsvExportParams } from 'types/client/address';

import type { ResourceName } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import throwOnAbsentParamError from 'lib/errors/throwOnAbsentParamError';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import useIsMobile from 'lib/hooks/useIsMobile';
import { nbsp } from 'toolkit/utils/htmlEntities';
import CsvExportForm from 'ui/csvExport/CsvExportForm';
import ContentLoader from 'ui/shared/ContentLoader';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import PageTitle from 'ui/shared/Page/PageTitle';

interface ExportTypeEntity {
  text: string;
  resource: ResourceName;
  fileNameTemplate: string;
  filterType?: CsvExportParams['filterType'];
  filterValues?: Readonly<Array<CsvExportParams['filterValue']>>;
}

const EXPORT_TYPES: Record<CsvExportParams['type'], ExportTypeEntity> = {
  transactions: {
    text: 'transactions',
    resource: 'general:csv_export_txs',
    fileNameTemplate: 'transactions',
    filterType: 'address',
    filterValues: AddressFromToFilterValues,
  },
  'internal-transactions': {
    text: 'internal transactions',
    resource: 'general:csv_export_internal_txs',
    fileNameTemplate: 'internal_transactions',
    filterType: 'address',
    filterValues: AddressFromToFilterValues,
  },
  'token-transfers': {
    text: 'token transfers',
    resource: 'general:csv_export_token_transfers',
    fileNameTemplate: 'token_transfers',
    filterType: 'address',
    filterValues: AddressFromToFilterValues,
  },
  logs: {
    text: 'logs',
    resource: 'general:csv_export_logs',
    fileNameTemplate: 'logs',
    filterType: 'topic',
  },
  holders: {
    text: 'holders',
    resource: 'general:csv_export_token_holders',
    fileNameTemplate: 'holders',
  },
  'epoch-rewards': {
    text: 'epoch rewards',
    resource: 'general:csv_export_epoch_rewards',
    fileNameTemplate: 'epoch_rewards',
  },
};

const isCorrectExportType = (type: string): type is CsvExportParams['type'] => Object.keys(EXPORT_TYPES).includes(type);

const CsvExport = () => {
  const router = useRouter();
  const appProps = useAppContext();
  const isMobile = useIsMobile();

  const addressHash = router.query.address?.toString() || '';
  const exportTypeParam = router.query.type?.toString() || '';
  const exportType = isCorrectExportType(exportTypeParam) ? EXPORT_TYPES[exportTypeParam] : null;
  const filterTypeFromQuery = router.query.filterType?.toString() || null;
  const filterValueFromQuery = router.query.filterValue?.toString();

  const addressQuery = useApiQuery('general:address', {
    pathParams: { hash: addressHash },
    queryOptions: {
      enabled: Boolean(addressHash),
    },
  });

  const tokenQuery = useApiQuery('general:token', {
    pathParams: { hash: addressHash },
    queryOptions: {
      enabled: Boolean(addressHash) && exportTypeParam === 'holders',
    },
  });

  const configQuery = useApiQuery('general:config_csv_export', {
    queryOptions: {
      enabled: Boolean(addressHash),
    },
  });

  const isLoading = addressQuery.isPending || configQuery.isPending || (exportTypeParam === 'holders' && tokenQuery.isPending);

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/address');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to address',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  throwOnAbsentParamError(addressHash);
  throwOnAbsentParamError(exportType);

  if (!exportType) {
    return null;
  }

  const filterType = filterTypeFromQuery === exportType.filterType ? filterTypeFromQuery : null;
  const filterValue = (() => {
    if (!filterType || !filterValueFromQuery) {
      return null;
    }

    if (exportType.filterValues && !exportType.filterValues?.includes(filterValueFromQuery)) {
      return null;
    }

    return filterValueFromQuery;
  })();

  const content = (() => {
    throwOnResourceLoadError(addressQuery);

    if (isLoading) {
      return <ContentLoader/>;
    }

    return (
      <CsvExportForm
        hash={ addressHash }
        resource={ exportType.resource }
        exportType={ isCorrectExportType(exportTypeParam) ? exportTypeParam : undefined }
        filterType={ filterType }
        filterValue={ filterValue }
        fileNameTemplate={ exportType.fileNameTemplate }
      />
    );
  })();

  const description = (() => {
    if (isLoading) {
      return null;
    }

    const limit = (configQuery.data?.limit || 10_000).toLocaleString(undefined, { maximumFractionDigits: 3, notation: 'compact' });

    if (exportTypeParam === 'holders' && tokenQuery.data) {
      return (
        <Flex mb={ 10 } whiteSpace="pre-wrap" flexWrap="wrap">
          <span>Export { exportType.text } for token </span>
          <TokenEntity
            token={ tokenQuery.data }
            truncation={ isMobile ? 'constant' : 'dynamic' }
            w="fit-content"
            maxW={{ base: '100%', lg: '400px' }}
            noCopy
            noSymbol
          />
          <span> to CSV file. </span>
          <span>Exports are limited to the top { limit } holders by amount held.</span>
        </Flex>
      );
    }

    if (!addressQuery.data) {
      return null;
    }

    return (
      <Flex mb={ 10 } whiteSpace="pre-wrap" flexWrap="wrap">
        <span>Export { exportType.text } for address </span>
        <AddressEntity
          address={ addressQuery.data }
          truncation={ isMobile ? 'constant' : 'dynamic' }
          noCopy
        />
        <span>{ nbsp }</span>
        { filterType && filterValue && <span>with applied filter by { filterType } ({ filterValue }) </span> }
        <span>to CSV file. </span>
        <span>Exports are limited to the last { limit } { exportType.text }.</span>
      </Flex>
    );
  })();

  return (
    <>
      <PageTitle
        title="Export data to CSV file"
        backLink={ backLink }
      />
      { description }
      { content }
    </>
  );
};

export default CsvExport;
