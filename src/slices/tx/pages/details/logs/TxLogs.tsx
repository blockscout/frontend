// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Text } from '@chakra-ui/react';
import React from 'react';

import type { TransactionLog } from 'src/slices/log/types/api';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import LogItem from 'src/slices/log/components/LogItem';
import { LOG } from 'src/slices/log/stubs/log';
import TxPendingAlert from 'src/slices/tx/components/TxPendingAlert';
import TxSocketAlert from 'src/slices/tx/components/TxSocketAlert';
import type { TxQuery } from 'src/slices/tx/hooks/useTxQuery';

import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';
import Pagination from 'src/shared/pagination/Pagination';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';

interface Props {
  txQuery: TxQuery;
  logsFilter?: (log: TransactionLog) => boolean;
}

const TxLogs = ({ txQuery, logsFilter }: Props) => {
  const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
    resourceName: 'general:tx_logs',
    pathParams: { hash: txQuery.data?.hash },
    options: {
      enabled: !txQuery.isPlaceholderData && Boolean(txQuery.data?.hash) && Boolean(txQuery.data?.status),
      placeholderData: generateListStub<'general:tx_logs'>(LOG, 3, { next_page_params: null }),
    },
  });

  if (!txQuery.isPending && !txQuery.isPlaceholderData && !txQuery.isError && !txQuery.data.status) {
    return txQuery.socketStatus ? <TxSocketAlert status={ txQuery.socketStatus }/> : <TxPendingAlert/>;
  }

  if (isError || txQuery.isError) {
    return <ApiFetchAlert/>;
  }

  let items: Array<TransactionLog> = [];

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
      { items.map((item, index) => (
        <LogItem
          key={ index }
          { ...item }
          type="transaction"
          isLoading={ isPlaceholderData }
          defaultDataType={ txQuery.data?.zilliqa?.is_scilla ? 'UTF-8' : undefined }
        />
      )) }
    </Box>
  );
};

export default TxLogs;
