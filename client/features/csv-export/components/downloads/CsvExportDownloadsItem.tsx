import { Text, HStack, VStack, Spinner } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { upperFirst } from 'es-toolkit';
import React from 'react';
import { useInView } from 'react-intersection-observer';

import config from 'configs/app';
import multichainConfig from 'configs/multichain';
import isNeedProxy from 'lib/api/isNeedProxy';
import dayjs from 'lib/date/dayjs';
import shortenString from 'lib/shortenString';
import { Button } from 'toolkit/chakra/button';
import { Link } from 'toolkit/chakra/link';
import { Status } from 'toolkit/chakra/status';
import { SECOND } from 'toolkit/utils/consts';
import IconSvg from 'ui/shared/IconSvg';

import getPrefixByFilter from '../../utils/getPrefixByFilter';
import * as storage from '../../utils/storage';
import type { StorageItem } from '../../utils/storage';

interface Props {
  index: number;
  data: StorageItem;
}

// TODO @tom2drum check downloads on multichain
const CsvExportDownloadsItem = ({ index, data }: Props) => {

  const viewItemTimeoutRef = React.useRef<number>(null);

  const [ expiresText, setExpiresText ] = React.useState<string>(
    data.expires_at && dayjs().isBefore(dayjs(data.expires_at)) ? dayjs(data.expires_at).fromNow() : 'soon',
  );

  const queryClient = useQueryClient();
  const chainData = data.params.chain_id ? multichainConfig()?.chains.find(({ id }) => id === data.params.chain_id) : undefined;

  React.useEffect(() => {
    if (data.status !== 'completed' || !data.expires_at) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const isExpired = dayjs().isAfter(dayjs(data.expires_at));
      if (isExpired) {
        window.clearInterval(intervalId);
        queryClient.fetchQuery({
          queryKey: [ 'general:csv_exports_item', data.request_id ],
        });
      }
      setExpiresText(dayjs(data.expires_at).fromNow());
    }, SECOND);

    return () => {
      window.clearInterval(intervalId);
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps -- queryClient is intentionally omitted to avoid restarting interval on client identity changes
  }, [ data.expires_at, data.status ]);

  const markItemAsViewed = React.useCallback(() => {
    storage.removeItem(data.request_id);
    queryClient.setQueryData<StorageItem>([ 'general:csv_exports_item', data.request_id ], (prevData) => {
      if (!prevData) {
        return;
      }
      return {
        ...prevData,
        is_highlighted: false,
      };
    });
  }, [ data.request_id, queryClient ]);

  const handleInViewChange = React.useCallback((inView: boolean) => {
    if (inView) {
      viewItemTimeoutRef.current = window.setTimeout(() => {
        markItemAsViewed();
      }, SECOND);
    }
  }, [ markItemAsViewed ]);

  const { ref } = useInView({
    triggerOnce: true,
    skip: ![ 'failed', 'expired' ].includes(data.status),
    threshold: 1,
    onChange: handleInViewChange,
  });

  React.useEffect(() => {
    return () => {
      window.clearTimeout(viewItemTimeoutRef.current ?? undefined);
    };
  }, []);

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
          title: `CSV file #${ index } is ${ !data.is_highlighted ? 'downloaded' : 'ready' }`,
          color: 'green.500',
          description: data.is_highlighted ? `The file will expire ${ expiresText }. It will be deleted after download.` : undefined,
        };
      }
      case 'failed': {
        return {
          title: `Export #${ index } has failed`,
          color: 'red.600',
          description: 'The export failed. Please try again.',
        };
      }
      case 'expired': {
        return {
          title: `Export #${ index } has expired`,
          color: 'red.600',
          description: 'The file storage time has expired. Try generating the report again.',
        };
      }
    }
  })();

  const exportDetailsText = (() => {
    const chainText = chainData ? `on ${ chainData.name }` : undefined;
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
      return `${ (chainData?.app_config || config).apis.general?.endpoint ?? '' }/downloadFile?id=${ data.file_id }`;
    }

    return `/downloadFile?id=${ data.file_id }`;
  })();

  return (
    <HStack alignItems="flex-start" ref={ ref }>
      { data.status === 'pending' ? <Spinner flexShrink={ 0 }/> : <IconSvg name="files/csv" boxSize={ 5 } color={ color }/> }
      <VStack alignItems="flex-start">
        <HStack justifyContent="space-between" w="full">
          <Text fontWeight={ 600 } color={ color }>
            { title }
          </Text>
          { data.is_highlighted && <Status/> }
        </HStack>
        { description && (
          <Text color="text.secondary">
            { description }
          </Text>
        ) }
        { exportDetailsText && (
          <Text color="text.secondary" fontWeight={ 600 }>
            { exportDetailsText }
          </Text>
        ) }
        { data.status === 'completed' && data.is_highlighted && (
          <Link
            href={ downloadLink }
            external
            noIcon
          >
            <Button
              variant="outline"
              size="sm"
              mt={ 2 }
              onClick={ markItemAsViewed }
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
