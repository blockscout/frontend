// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'client/shell/page/action-bar/ActionBar';
import PageTitle from 'client/shell/page/title/PageTitle';

import { VALIDATORS_ZILLIQA_ITEM } from 'client/features/chain-variants/zilliqa/stubs/validators';

import DataList from 'client/shared/lists/DataList';
import Pagination from 'client/shared/pagination/Pagination';
import useQueryWithPages from 'client/shared/pagination/useQueryWithPages';
import { generateListStub } from 'client/shared/pagination/utils';

import config from 'configs/app';

import ValidatorsList from './ValidatorsList';
import ValidatorsTable from './ValidatorsTable';

const ValidatorsZilliqa = () => {
  const { isError, isPlaceholderData, data, pagination } = useQueryWithPages({
    resourceName: 'general:validators_zilliqa',
    options: {
      enabled: config.features.validators.isEnabled,
      placeholderData: generateListStub<'general:validators_zilliqa'>(
        VALIDATORS_ZILLIQA_ITEM,
        50,
        { next_page_params: null },
      ),
    },
  });

  const actionBar = pagination.isVisible ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        <ValidatorsList data={ data.items } isLoading={ isPlaceholderData }/>
      </Box>
      <Box hideBelow="lg">
        <ValidatorsTable data={ data.items } isLoading={ isPlaceholderData } top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }/>
      </Box>
    </>
  ) : null;

  return (
    <Box>
      <PageTitle title="Validators" withTextAd/>
      <DataList
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no validators."
        actionBar={ actionBar }
      >
        { content }
      </DataList>
    </Box>
  );
};

export default ValidatorsZilliqa;
