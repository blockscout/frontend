import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { CsvExportType } from 'types/client/address';

import type { ResourceName } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/appContext';
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
}

const EXPORT_TYPES: Record<CsvExportType, ExportTypeEntity> = {
  transactions: {
    text: 'transactions',
    resource: 'csv_export_txs',
    fileNameTemplate: 'transactions',
  },
  'internal-transactions': {
    text: 'internal transactions',
    resource: 'csv_export_internal_txs',
    fileNameTemplate: 'internal_transactions',
  },
  'token-transfers': {
    text: 'token transfers',
    resource: 'csv_export_token_transfers',
    fileNameTemplate: 'token_transfers',
  },
};

const isCorrectExportType = (type: string): type is CsvExportType => Object.keys(EXPORT_TYPES).includes(type);

const CsvExport = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const appProps = useAppContext();

  const addressHash = router.query.address?.toString() || '';
  const exportType = router.query.type?.toString() || '';
  const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/address');

  const addressQuery = useApiQuery('address', {
    pathParams: { hash: addressHash },
    queryOptions: {
      enabled: Boolean(addressHash),
    },
  });

  if (!isCorrectExportType(exportType) || !addressHash || addressQuery.error?.status === 400) {
    throw Error('Not found', { cause: { status: 404 } });
  }

  const content = (() => {
    if (addressQuery.isError) {
      return <DataFetchAlert/>;
    }

    if (addressQuery.isLoading) {
      return <ContentLoader/>;
    }

    return <CsvExportForm hash={ addressHash } resource={ EXPORT_TYPES[exportType].resource } fileNameTemplate={ EXPORT_TYPES[exportType].fileNameTemplate }/>;
  })();

  return (
    <Page>
      <PageTitle
        text="Export data to CSV file"
        backLinkUrl={ hasGoBackLink ? appProps.referrer : undefined }
        backLinkLabel="Back to address"
      />
      <Flex mb={ 10 } whiteSpace="pre-wrap" flexWrap="wrap">
        <span>Export { EXPORT_TYPES[exportType].text } for address </span>
        <Address>
          <AddressIcon address={{ hash: addressHash, is_contract: true, implementation_name: null }}/>
          <AddressLink hash={ addressHash } type="address" ml={ 2 } truncation={ isMobile ? 'constant' : 'dynamic' }/>
        </Address>
        <span> to CSV file</span>
      </Flex>
      { content }
    </Page>
  );
};

export default CsvExport;
