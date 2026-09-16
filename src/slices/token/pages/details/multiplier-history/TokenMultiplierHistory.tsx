// SPDX-License-Identifier: LicenseRef-Blockscout

import type { schemas } from '@blockscout/api-types';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import { TOKEN_UI_MULTIPLIER_CHANGE } from 'src/slices/token/stubs';

import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';

import TokenMultiplierHistoryTable from './TokenMultiplierHistoryTable';

interface Props {
  token: schemas['Token'] | undefined;
  isLoading: boolean;
}

const TokenMultiplierHistory = ({ token, isLoading }: Props) => {
  const query = useQueryWithPages({
    resourceName: 'core:token_ui_multiplier_changes',
    pathParams: { hash: token?.address_hash },
    options: {
      enabled: Boolean(token?.address_hash) && !isLoading,
      placeholderData: generateListStub<'core:token_ui_multiplier_changes'>(TOKEN_UI_MULTIPLIER_CHANGE, 50, { next_page_params: null }),
    },
  });

  const actionBar = query.pagination.isVisible ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...query.pagination }/>
    </ActionBar>
  ) : null;

  const content = query.data?.items ? (
    <TokenMultiplierHistoryTable
      data={ query.data.items }
      page={ query.pagination.page }
      top={ query.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
      isLoading={ query.isPlaceholderData }
      resetKey={ query.queryHash }
    />
  ) : null;

  return (
    <DataList
      isError={ query.isError }
      itemsNum={ query.data?.items.length }
      emptyText="There are no multiplier changes for this token."
      actionBar={ actionBar }
    >
      { content }
    </DataList>
  );
};

export default TokenMultiplierHistory;
