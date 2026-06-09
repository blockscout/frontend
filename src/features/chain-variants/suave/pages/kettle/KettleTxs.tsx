// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import PageTitle from 'src/shell/page/title/PageTitle';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import TxsWithFrontendSorting from 'src/slices/tx/pages/index/list/TxsWithFrontendSorting';
import { TX } from 'src/slices/tx/stubs/tx';

import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';

const KettleTxs = () => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);

  const query = useQueryWithPages({
    resourceName: 'core:txs_execution_node',
    pathParams: { hash },
    options: {
      placeholderData: generateListStub<'core:txs_execution_node'>(TX, 50, { next_page_params: {
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
