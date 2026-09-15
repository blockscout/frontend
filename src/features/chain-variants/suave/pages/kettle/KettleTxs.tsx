// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import PageTitle from 'src/shell/page/title/PageTitle';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import TxsWithFrontendSorting from 'src/slices/tx/pages/index/list/TxsWithFrontendSorting';
import { TX_ITEM } from 'src/slices/tx/stubs/tx';

import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';

const KettleTxs = () => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);

  const query = useApiPaginatedQuery({
    resourceName: 'core:txs_execution_node',
    pathParams: { hash },
    options: {
      placeholderData: generateListStub<'core:txs_execution_node'>(TX_ITEM, 50, { next_page_params: {
        block_number: 9005713,
        index: 5,
        items_count: 50,
        filter: 'validated',
      } }),
    },
  });

  return (
    <>
      <PageTitle title="Computor transactions" withTextAd/>
      <AddressEntity address={{ hash }} mb={ 6 }/>
      <TxsWithFrontendSorting query={ query }/>
    </>
  );
};

export default KettleTxs;
