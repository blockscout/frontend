import { Text, HStack, VStack, Spinner } from '@chakra-ui/react';
import { upperFirst } from 'es-toolkit';
import React from 'react';

import type { CsvExportDownloadStatus, CsvExportType } from '../../types/client';

import dayjs from 'lib/date/dayjs';
import shortenString from 'lib/shortenString';
import { Button } from 'toolkit/chakra/button';
import IconSvg from 'ui/shared/IconSvg';

import getPrefixByFilter from '../../utils/getPrefixByFilter';

interface Props {
  index: number;
  status: CsvExportDownloadStatus;
  params: Record<string, string>;
  type: CsvExportType;
}

const CsvExportDownloadsItem = ({ index, status, params, type }: Props) => {

  const { title, color, description } = (() => {
    switch (status) {
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
          description: 'The file will expire in 3 hours. It will be deleted after download.',
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
    const chainText = 'chain_name' in params ? `on ${ params.chain_name }` : undefined;
    const periodText = params.from_period && params.to_period ?
      `from ${ dayjs(params.from_period).format('lll') } to ${ dayjs(params.to_period).format('lll') }` :
      undefined;

    if (type === 'token_holders') {
      return [
        'Token holders for token',
        params.token_name,
        chainText,
        periodText,
      ].filter(Boolean).join(' ');
    }

    if (type.startsWith('address_')) {
      const entityPrefix = getPrefixByFilter(params?.filter_type, params?.filter_value);

      return upperFirst([
        entityPrefix,
        type.replace('address_', '').replace('_', ' '),
        'for',
        shortenString(params.hash),
        chainText,
        periodText,
      ].filter(Boolean).join(' '));
    }

    if (type === 'advanced_filters') {
      const dateText = params.created_at ? `at ${ dayjs(params.created_at).format('lll') }` : undefined;
      return [
        'Filtered transactions',
        chainText,
        dateText,
      ].filter(Boolean).join(' ');
    }
  })();

  return (
    <HStack alignItems="flex-start">
      { status === 'pending' ? <Spinner flexShrink={ 0 }/> : <IconSvg name="files/csv" boxSize={ 5 } color={ color }/> }
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
        { status === 'completed' && (
          <Button
            variant="outline"
            size="sm"
            mt={ 2 }
          >
            Download CSV
          </Button>
        ) }
      </VStack>
    </HStack>
  );
};

export default React.memo(CsvExportDownloadsItem);
