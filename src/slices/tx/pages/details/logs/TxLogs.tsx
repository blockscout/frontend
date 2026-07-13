// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Text } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import LogItem from 'src/slices/log/components/LogItem';
import { LOG } from 'src/slices/log/stubs/log';
import TxPendingAlert from 'src/slices/tx/components/TxPendingAlert';
import TxSocketAlert from 'src/slices/tx/components/TxSocketAlert';
import type { TxQuery } from 'src/slices/tx/hooks/useTxQuery';

import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';
import Pagination from 'src/shared/pagination/Pagination';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';

// log rows are tall, so the initial window is smaller than the default
const INITIAL_RENDERED_ITEMS_NUM = 10;

interface Props {
  txQuery: TxQuery;
  logsFilter?: (log: schemas['Log']) => boolean;
}

const TxLogs = ({ txQuery, logsFilter }: Props) => {
  const { data, isPlaceholderData, isError, pagination, queryHash } = useQueryWithPages({
    resourceName: 'core:tx_logs',
    pathParams: { hash: txQuery.data?.hash },
    options: {
      enabled: !txQuery.isPlaceholderData && Boolean(txQuery.data?.hash) && Boolean(txQuery.data?.status),
      placeholderData: generateListStub<'core:tx_logs'>(LOG, 3, { next_page_params: null }),
    },
  });

  const { cutRef, renderedItemsNum } = useLazyRenderedList({
    list: data?.items,
    isEnabled: !isPlaceholderData,
    minItemsNum: INITIAL_RENDERED_ITEMS_NUM,
    resetKey: queryHash,
  });

  if (!txQuery.isPending && !txQuery.isPlaceholderData && !txQuery.isError && !txQuery.data.status) {
    return txQuery.socketStatus ? <TxSocketAlert status={ txQuery.socketStatus }/> : <TxPendingAlert/>;
  }

  if (isError || txQuery.isError) {
    return <ApiFetchAlert/>;
  }

  let items: Array<schemas['Log']> = [];

  if (data?.items) {
    if (isPlaceholderData) {
      items = data?.items;
    } else {
      items = logsFilter ? data.items.filter(logsFilter) : data.items;
    }
  }

  if (!items.length) {
    return <Text as="span">There are no logs for this transaction.</Text>;
  }

  return (
    <Box>
      { pagination.isVisible && (
        <ActionBar mt={ -6 }>
          <Pagination ml="auto" { ...pagination }/>
        </ActionBar>
      ) }
      { items.slice(0, renderedItemsNum).map((item, index) => (
        <LogItem
          key={ index }
          data={ item }
          type="transaction"
          isLoading={ isPlaceholderData }
          defaultDataType={ txQuery.data?.zilliqa?.is_scilla ? 'UTF-8' : undefined }
        />
      )) }
      <Box ref={ cutRef } h={ 0 }/>
    </Box>
  );
};

export default TxLogs;
