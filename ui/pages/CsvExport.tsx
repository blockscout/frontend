import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { AddressFromToFilterValues } from 'types/api/address';
import type { CsvExportParams } from 'types/client/address';

import type { ResourceName } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import CsvExportForm from 'ui/csvExport/CsvExportForm';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Page from 'ui/shared/Page/Page';
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
    resource: 'csv_export_txs',
    fileNameTemplate: 'transactions',
    filterType: 'address',
    filterValues: AddressFromToFilterValues,
  },
  'internal-transactions': {
    text: 'internal transactions',
    resource: 'csv_export_internal_txs',
    fileNameTemplate: 'internal_transactions',
    filterType: 'address',
    filterValues: AddressFromToFilterValues,
  },
  'token-transfers': {
    text: 'token transfers',
    resource: 'csv_export_token_transfers',
    fileNameTemplate: 'token_transfers',
    filterType: 'address',
    filterValues: AddressFromToFilterValues,
  },
  logs: {
    text: 'logs',
    resource: 'csv_export_logs',
    fileNameTemplate: 'logs',
    filterType: 'topic',
  },
};

const isCorrectExportType = (type: string): type is CsvExportParams['type'] => Object.keys(EXPORT_TYPES).includes(type);

const CsvExport = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const appProps = useAppContext();

  const addressHash = router.query.address?.toString() || '';
  const exportType = router.query.type?.toString() || '';
  const filterTypeFromQuery = router.query.filterType?.toString() || null;
  const filterValueFromQuery = router.query.filterValue?.toString();

  const addressQuery = useApiQuery('address', {
    pathParams: { hash: addressHash },
    queryOptions: {
      enabled: Boolean(addressHash),
    },
  });

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

  if (!isCorrectExportType(exportType) || !addressHash || addressQuery.error?.status === 400) {
    throw Error('Not found', { cause: { status: 404 } });
  }

  const filterType = filterTypeFromQuery === EXPORT_TYPES[exportType].filterType ? filterTypeFromQuery : null;
  const filterValue = (() => {
    if (!filterType || !filterValueFromQuery) {
      return null;
    }

    if (EXPORT_TYPES[exportType].filterValues && !EXPORT_TYPES[exportType].filterValues?.includes(filterValueFromQuery)) {
      return null;
    }

    return filterValueFromQuery;
  })();

  const content = (() => {
    if (addressQuery.isError) {
      return <DataFetchAlert/>;
    }

    if (addressQuery.isLoading) {
      return <ContentLoader/>;
    }

    return (
      <CsvExportForm
        hash={ addressHash }
        resource={ EXPORT_TYPES[exportType].resource }
        filterType={ filterType }
        filterValue={ filterValue }
        fileNameTemplate={ EXPORT_TYPES[exportType].fileNameTemplate }
      />
    );
  })();

  return (
    <Page>
      <PageTitle
        title="Export data to CSV file"
        backLink={ backLink }
      />
      <Flex mb={ 10 } whiteSpace="pre-wrap" flexWrap="wrap">
        <span>Export { EXPORT_TYPES[exportType].text } for address </span>
        <Address>
          <AddressIcon address={{ hash: addressHash, is_contract: true, implementation_name: null }}/>
          <AddressLink hash={ addressHash } type="address" ml={ 2 } truncation={ isMobile ? 'constant' : 'dynamic' }/>
        </Address>
        { filterType && filterValue && <span> with applied filter by { filterType } ({ filterValue })</span> }
        <span> to CSV file</span>
      </Flex>
      { content }
    </Page>
  );
};

export default CsvExport;
