// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import AddressEntity from 'client/slices/address/components/entity/AddressEntity';
import TxsWithFrontendSorting from 'client/slices/tx/pages/index/list/TxsWithFrontendSorting';
import { TX } from 'client/slices/tx/stubs/tx';

import { generateListStub } from 'client/shared/pagination/utils';
import getQueryParamString from 'client/shared/router/get-query-param-string';

import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

const KettleTxs = () => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);

  const query = useQueryWithPages({
    resourceName: 'general:txs_execution_node',
    pathParams: { hash },
    options: {
      placeholderData: generateListStub<'general:txs_execution_node'>(TX, 50, { next_page_params: {
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
