import { Accordion, Hide, Show, Text } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { TX_STATE_CHANGES } from 'stubs/txStateChanges';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import TxStateList from 'ui/tx/state/TxStateList';
import TxStateTable from 'ui/tx/state/TxStateTable';

import TxPendingAlert from './TxPendingAlert';
import TxSocketAlert from './TxSocketAlert';
import type { TxQuery } from './useTxQuery';

interface Props {
  txQuery: TxQuery;
}

const TxState = ({ txQuery }: Props) => {
  const { t } = useTranslation('common');

  const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
    resourceName: 'tx_state_changes',
    pathParams: { hash: txQuery.data?.hash },
    options: {
      enabled: !txQuery.isPlaceholderData && Boolean(txQuery.data?.hash) && Boolean(txQuery.data?.status),
      placeholderData: {
        items: TX_STATE_CHANGES,
        next_page_params: {
          items_count: 1,
          state_changes: null,
        },
      },
    },
  });

  if (!txQuery.isPending && !txQuery.isPlaceholderData && !txQuery.isError && !txQuery.data.status) {
    return txQuery.socketStatus ? <TxSocketAlert status={ txQuery.socketStatus }/> : <TxPendingAlert/>;
  }

  const content = data ? (
    <Accordion allowMultiple defaultIndex={ [] }>
      <Hide below="lg" ssr={ false }>
        <TxStateTable data={ data.items } isLoading={ isPlaceholderData } top={ pagination.isVisible ? 80 : 0 }/>
      </Hide>
      <Show below="lg" ssr={ false }>
        <TxStateList data={ data.items } isLoading={ isPlaceholderData }/>
      </Show>
    </Accordion>
  ) : null;

  const actionBar = pagination.isVisible ? (
    <ActionBar mt={ -6 } showShadow>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  return (
    <>
      { !isError && !txQuery.isError && (
        <Text mb={ 6 }>
          { t('tx_area.A_set_of_information_that_represents_the_current_state_is_') }
        </Text>
      ) }
      <DataListDisplay
        isError={ isError || txQuery.isError }
        items={ data?.items }
        emptyText={ t('tx_area.There_are_no_state_changes_for_this_transaction') }
        content={ content }
        actionBar={ actionBar }
      />
    </>
  );
};

export default TxState;
