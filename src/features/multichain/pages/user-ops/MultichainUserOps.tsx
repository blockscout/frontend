// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import multichainConfig from 'src/features/multichain/chains-config';
import ChainSelect from 'src/features/multichain/components/ChainSelect';
import { MultichainProvider } from 'src/features/multichain/context';
import { useChainValue } from 'src/features/multichain/hooks/useChainValue';
import UserOpsTable from 'src/features/user-ops/pages/index/UserOpsTable';
import { USER_OPS_ITEM } from 'src/features/user-ops/stubs';

import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { generateListStub } from 'src/shared/pagination/utils';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

const MultichainUserOps = () => {

  const chains = React.useMemo(() => (multichainConfig()?.chains || []).filter(chain => chain.app_config.features.userOps.isEnabled), []);
  const chainIds = React.useMemo(() => chains.map(chain => chain.id).filter(Boolean), [ chains ]);
  const { chainValue, chain, onChainValueChange } = useChainValue({ chainIds });

  const query = useApiPaginatedQuery({
    resourceName: 'core:user_ops',
    options: {
      placeholderData: generateListStub<'core:user_ops'>(USER_OPS_ITEM, 50, { next_page_params: {
        page_token: '10355938',
        page_size: 50,
      } }),
    },
    chain,
  });

  const content = query.data?.items ? (
    <MultichainProvider chainId={ chain?.id }>
      <TableContainerScrollable>
        <UserOpsTable
          items={ query.data.items }
          top={ query.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ query.isInitialLoading }
          showTx
          showSender
          resetKey={ query.queryHash }
        />
      </TableContainerScrollable>
    </MultichainProvider>
  ) : null;

  const actionBar = (
    <ActionBar mt={ -6 }>
      <ChainSelect
        value={ chainValue }
        onValueChange={ onChainValueChange }
        chainIds={ chainIds }
      />
      <Pagination ml="auto" { ...query.pagination }/>
    </ActionBar>
  );

  return (
    <>
      <PageTitle
        title="User operations"
        withTextAd
      />
      <DataList
        isError={ query.isError }
        itemsNum={ query.data?.items?.length }
        emptyText="There are no user operations."
        actionBar={ actionBar }
        showActionBarIfError
        showActionBarIfEmpty
        isTransitioning={ query.isTransitioning }
      >
        { content }
      </DataList>
    </>
  );
};

export default React.memo(MultichainUserOps);
