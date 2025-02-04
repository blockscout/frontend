import { Box, Hide, Show } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import { generateListStub } from 'stubs/utils';
import { VALIDATORS_ZILLIQA_ITEM } from 'stubs/validators';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import ValidatorsList from 'ui/validators/zilliqa/ValidatorsList';
import ValidatorsTable from 'ui/validators/zilliqa/ValidatorsTable';

const ValidatorsZilliqa = () => {

  const isMobile = useIsMobile();

  const { isError, isPlaceholderData, data, pagination } = useQueryWithPages({
    resourceName: 'validators_zilliqa',
    options: {
      enabled: config.features.validators.isEnabled,
      placeholderData: generateListStub<'validators_zilliqa'>(
        VALIDATORS_ZILLIQA_ITEM,
        50,
        { next_page_params: null },
      ),
    },
  });

  const actionBar = (!isMobile || pagination.isVisible) ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>
        <ValidatorsList data={ data.items } isLoading={ isPlaceholderData }/>
      </Show>
      <Hide below="lg" ssr={ false }>
        <ValidatorsTable data={ data.items } isLoading={ isPlaceholderData }/>
      </Hide>
    </>
  ) : null;

  return (
    <Box>
      <PageTitle title="Validators" withTextAd/>
      <DataListDisplay
        isError={ isError }
        items={ data?.items }
        emptyText="There are no validators."
        content={ content }
        actionBar={ actionBar }
      />
    </Box>
  );
};

export default ValidatorsZilliqa;
