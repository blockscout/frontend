import { Text, HStack, VStack, Spinner } from '@chakra-ui/react';
import { upperFirst } from 'es-toolkit';
import React from 'react';

import config from 'configs/app';
import isNeedProxy from 'lib/api/isNeedProxy';
import dayjs from 'lib/date/dayjs';
import shortenString from 'lib/shortenString';
import { Button } from 'toolkit/chakra/button';
import { Link } from 'toolkit/chakra/link';
import IconSvg from 'ui/shared/IconSvg';

import getPrefixByFilter from '../../utils/getPrefixByFilter';
import * as storage from '../../utils/storage';
import type { StorageItem } from '../../utils/storage';

interface Props {
  index: number;
  data: StorageItem;
}

// TODO @tom2drum interval for updating expires_at time

const CsvExportDownloadsItem = ({ index, data }: Props) => {

  const [ isDownloaded, setIsDownloaded ] = React.useState(false);

  const handleDownloadClick = React.useCallback(() => {
    setIsDownloaded(true);
    storage.removeItem(data.request_id);
  }, [ data.request_id, setIsDownloaded ]);

  const { title, color, description } = (() => {
    switch (data.status) {
      case 'pending': {
        return {
          title: `Export #${ index } in progress...`,
          color: undefined,
          description: 'We collect data and prepare file for export.',
        };
      }
      case 'completed': {
        return {
          title: `CSV file #${ index } is ready`,
          color: 'green.500',
          description: `The file will expire ${ data.expires_at ? dayjs(data.expires_at).fromNow() : 'soon' }. It will be deleted after download.`,
        };
      }
      case 'failed': {
        return {
          title: `Export #${ index } failed`,
          color: 'red.600',
          description: 'The export failed. Please try again.',
        };
      }
      case 'expired': {
        return {
          title: `Export #${ index } expired`,
          color: 'red.600',
          description: 'The file storage time has expired. Try generating the report again.',
        };
      }
    }
  })();

  const exportDetailsText = (() => {
    // TODO @tom2drum add chain id to params and check downloads on multichain
    const chainText = 'chain_name' in data.params ? `on ${ data.params.chain_name }` : undefined;
    const periodText = data.params.from_period && data.params.to_period ?
      `from ${ dayjs(data.params.from_period).format('lll') } to ${ dayjs(data.params.to_period).format('lll') }` :
      undefined;

    if (data.type === 'token_holders') {
      return [
        'Token holders for token',
        data.params.token_name,
        chainText,
        periodText,
      ].filter(Boolean).join(' ');
    }

    if (data.type.startsWith('address_')) {
      const entityPrefix = getPrefixByFilter(data.params?.filter_type, data.params?.filter_value);

      return upperFirst([
        entityPrefix,
        data.type.replace('address_', '').replace('_', ' '),
        'for',
        shortenString(data.params.hash),
        chainText,
        periodText,
      ].filter(Boolean).join(' '));
    }

    if (data.type === 'advanced_filters') {
      const dateText = data.params.created_at ? `at ${ dayjs(data.params.created_at).format('lll') }` : undefined;
      return [
        'Filtered txs',
        chainText,
        dateText,
      ].filter(Boolean).join(' ');
    }
  })();

  const downloadLink = (() => {
    if (data.status !== 'completed' || !data.file_id) {
      return;
    }

    if (isNeedProxy()) {
      return `${ config.apis.general?.endpoint ?? '' }/downloadFile?id=${ data.file_id }`;
    }

    return `/downloadFile?id=${ data.file_id }`;
  })();

  return (
    <HStack alignItems="flex-start">
      { data.status === 'pending' ? <Spinner flexShrink={ 0 }/> : <IconSvg name="files/csv" boxSize={ 5 } color={ color }/> }
      <VStack alignItems="flex-start">
        <Text fontWeight={ 600 } color={ color }>
          { title }
        </Text>
        <Text color="text.secondary">
          { description }
        </Text>
        { exportDetailsText && (
          <Text color="text.secondary" fontWeight={ 600 }>
            { exportDetailsText }
          </Text>
        ) }
        { data.status === 'completed' && !isDownloaded && (
          <Link
            href={ downloadLink }
            external
            noIcon
          >
            <Button
              variant="outline"
              size="sm"
              mt={ 2 }
              onClick={ handleDownloadClick }
            >
              Download CSV
            </Button>
          </Link>
        ) }
      </VStack>
    </HStack>
  );
};

export default React.memo(CsvExportDownloadsItem);
