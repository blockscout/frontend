// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'client/api/socket/types';
import type { IndexingStatus } from 'types/api/indexingStatus';

import useApiQuery, { getResourceKey } from 'client/api/hooks/useApiQuery';
import useSocketChannel from 'client/api/socket/useSocketChannel';
import useSocketMessage from 'client/api/socket/useSocketMessage';

import * as cookies from 'client/shared/storage/cookies';

import config from 'configs/app';
import { useAppContext } from 'lib/contexts/app';
import { Alert } from 'toolkit/chakra/alert';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { nbsp, ndash } from 'toolkit/utils/htmlEntities';

const IndexingBlocksAlert = () => {
  const appProps = useAppContext();
  const cookiesString = appProps.cookies;
  const [ hasAlertCookie ] = React.useState(cookies.get(cookies.NAMES.INDEXING_ALERT, cookiesString) === 'true');

  const { data, isError, isPending } = useApiQuery('general:homepage_indexing_status', {
    queryOptions: {
      enabled: !config.UI.indexingAlert.blocks.isHidden,
    },
  });

  React.useEffect(() => {
    if (!isPending && !isError) {
      cookies.set(cookies.NAMES.INDEXING_ALERT, data.finished_indexing_blocks ? 'false' : 'true');
    }
  }, [ data, isError, isPending ]);

  const queryClient = useQueryClient();

  const handleBlocksIndexStatus: SocketMessage.BlocksIndexStatus['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData(getResourceKey('general:homepage_indexing_status'), (prevData: IndexingStatus | undefined) => {

      const newData = prevData ? { ...prevData } : {} as IndexingStatus;
      newData.finished_indexing_blocks = payload.finished;
      newData.indexed_blocks_ratio = payload.ratio;

      return newData;
    });
  }, [ queryClient ]);

  const blockIndexingChannel = useSocketChannel({
    topic: 'blocks:indexing',
    isDisabled: !data || data.finished_indexing_blocks || config.UI.indexingAlert.blocks.isHidden,
  });

  useSocketMessage({
    channel: blockIndexingChannel,
    event: 'index_status',
    handler: handleBlocksIndexStatus,
  });

  if (config.UI.indexingAlert.blocks.isHidden) {
    return null;
  }

  if (isError) {
    return null;
  }

  if (isPending) {
    return hasAlertCookie ? <Skeleton loading h={{ base: '96px', lg: '48px' }} w="100%"/> : null;
  }

  if (data.finished_indexing_blocks !== false) {
    return null;
  }

  return (
    <Alert status="info" py={ 3 } borderRadius="md" showIcon>
      { `${ data.indexed_blocks_ratio && `${ Math.floor(Number(data.indexed_blocks_ratio) * 100) }% Blocks Indexed${ nbsp }${ ndash } ` }
          We're indexing this chain right now. Some of the counts may be inaccurate.` }
    </Alert>
  );
};

export default React.memo(IndexingBlocksAlert);
