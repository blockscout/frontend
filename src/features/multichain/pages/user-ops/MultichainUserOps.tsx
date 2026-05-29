// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import multichainConfig from 'src/features/multichain/chains-config';
import ChainSelect from 'src/features/multichain/components/ChainSelect';
import { MultichainProvider } from 'src/features/multichain/context';
import UserOpsListItem from 'src/features/user-ops/pages/index/UserOpsListItem';
import UserOpsTable from 'src/features/user-ops/pages/index/UserOpsTable';
import { USER_OPS_ITEM } from 'src/features/user-ops/stubs';

import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';

const MultichainUserOps = () => {

  const chains = React.useMemo(() => (multichainConfig()?.chains || []).filter(chain => chain.app_config.features.userOps.isEnabled), []);
  const chainIds = React.useMemo(() => chains.map(chain => chain.id).filter(Boolean), [ chains ]);

  const query = useQueryWithPages({
    resourceName: 'general:user_ops',
    options: {
      placeholderData: generateListStub<'general:user_ops'>(USER_OPS_ITEM, 50, { next_page_params: {
        page_token: '10355938',
        page_size: 50,
      } }),
    },
    isMultichain: true,
    chainIds,
  });

  const chainConfig = chains.find(chain => chain.id === query.chainValue?.[0]);

  const content = query.data?.items ? (
    <MultichainProvider chainId={ query.chainValue?.[0] }>
      <Box hideBelow="lg">
        <UserOpsTable
          items={ query.data.items }
          top={ query.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }
          isLoading={ query.isPlaceholderData }
          showTx
          showSender
        />
      </Box>
      <Box hideFrom="lg">
        { query.data.items.map((item, index) => (
          <UserOpsListItem
            key={ item.hash + (query.isPlaceholderData ? String(index) : '') }
            item={ item }
            isLoading={ query.isPlaceholderData }
            showTx
            showSender
            chainData={ chainConfig }
          />
        )) }
      </Box>
    </MultichainProvider>
  ) : null;

  const actionBar = (
    <ActionBar mt={ -6 }>
      <ChainSelect
        value={ query.chainValue }
        onValueChange={ query.onChainValueChange }
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
      >
        { content }
      </DataList>
    </>
  );
};

export default React.memo(MultichainUserOps);
