import { Box } from '@chakra-ui/react';
import React from 'react';

import multichainConfig from 'configs/multichain';
import { MultichainProvider } from 'lib/contexts/multichain';
import { USER_OPS_ITEM } from 'stubs/userOps';
import { generateListStub } from 'stubs/utils';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import ChainSelect from 'ui/shared/multichain/ChainSelect';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import UserOpsListItem from 'ui/userOps/UserOpsListItem';
import UserOpsTable from 'ui/userOps/UserOpsTable';

const OpSuperchainUserOps = () => {

  const query = useQueryWithPages({
    resourceName: 'general:user_ops',
    options: {
      placeholderData: generateListStub<'general:user_ops'>(USER_OPS_ITEM, 50, { next_page_params: {
        page_token: '10355938',
        page_size: 50,
      } }),
    },
    isMultichain: true,
  });

  const chainConfig = multichainConfig()?.chains.find(chain => chain.slug === query.chainValue?.[0]);

  const content = query.data?.items ? (
    <MultichainProvider chainSlug={ query.chainValue?.[0] }>
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
      <DataListDisplay
        isError={ query.isError }
        itemsNum={ query.data?.items?.length }
        emptyText="There are no user operations."
        actionBar={ actionBar }
        showActionBarIfError
        showActionBarIfEmpty
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default React.memo(OpSuperchainUserOps);
