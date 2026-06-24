// SPDX-License-Identifier: LicenseRef-Blockscout

import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { operations } from '@blockscout/api-types';
import type { SocketMessage } from 'src/api/socket/types';

import useApiQuery, { getResourceKey } from 'src/api/hooks/useApiQuery';
import useSocketChannel from 'src/api/socket/useSocketChannel';
import useSocketMessage from 'src/api/socket/useSocketMessage';

import { useAppContext } from 'src/shell/app/context';

import config from 'src/config';
import * as cookies from 'src/shared/storage/cookies';

import { Alert } from 'src/toolkit/chakra/alert';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { nbsp, ndash } from 'src/toolkit/utils/htmlEntities';

const IndexingStatusBlocks = () => {
  const appProps = useAppContext();
  const cookiesString = appProps.cookies;
  const [ hasAlertCookie ] = React.useState(cookies.get(cookies.NAMES.INDEXING_ALERT, cookiesString) === 'true');

  const { data, isError, isPending } = useApiQuery('core:homepage_indexing_status', {
    queryOptions: {
      enabled: !config.chain.indexingStatus.blocks.isHidden,
    },
  });

  React.useEffect(() => {
    if (!isPending && !isError) {
      cookies.set(cookies.NAMES.INDEXING_ALERT, data.finished_indexing_blocks ? 'false' : 'true');
    }
  }, [ data, isError, isPending ]);

  const queryClient = useQueryClient();

  const handleBlocksIndexStatus: SocketMessage.BlocksIndexStatus['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData(
      getResourceKey('core:homepage_indexing_status'),
      (prevData: operations['MainPageController.indexing_status']['json'] | undefined) => {

        const newData = prevData ? {
          ...prevData,
          finished_indexing_blocks: payload.finished,
          indexed_blocks_ratio: payload.ratio,
        } : undefined;

        return newData;
      });
  }, [ queryClient ]);

  const blockIndexingChannel = useSocketChannel({
    topic: 'blocks:indexing',
    isDisabled: !data || data.finished_indexing_blocks || config.chain.indexingStatus.blocks.isHidden,
  });

  useSocketMessage({
    channel: blockIndexingChannel,
    event: 'index_status',
    handler: handleBlocksIndexStatus,
  });

  if (config.chain.indexingStatus.blocks.isHidden) {
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

export default React.memo(IndexingStatusBlocks);
