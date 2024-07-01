import { type UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { AspectDetail as TAspectDetail } from '../../types/api/aspect';

import type { ResourceError } from '../../lib/api/resources';
import getQueryParamString from '../../lib/router/getQueryParamString';
import { ASPECTTXS } from '../../stubs/aspect';
import { generateListStub } from '../../stubs/utils';
import ActionBar from '../shared/ActionBar';
import Pagination from '../shared/pagination/Pagination';
import useQueryWithPages from '../shared/pagination/useQueryWithPages';
import AspectTxsContent from './AspectTxsContent';

type Props = {
  scrollRef?: React.RefObject<HTMLDivElement>;
  aspectQuery?: UseQueryResult<TAspectDetail, ResourceError>;
}

const AspectTxs = ({ scrollRef }: Props) => {
  const router = useRouter();

  const currentAddress = getQueryParamString(router.query.hash);

  const txsQuery = useQueryWithPages({
    resourceName: 'aspect_transactions',
    pathParams: { hash: currentAddress },
    scrollRef,
    options: {
      placeholderData: generateListStub<'aspect_transactions'>(ASPECTTXS, 50, { next_page_params: {
        block_number: 9005713,
        index: 5,
        items_count: 50,
      } }),
    },
  });

  return (
    <>
      <ActionBar mt={ -6 } justifyContent="flex-end">
        <Pagination { ...txsQuery.pagination } ml={ 8 }/>
      </ActionBar>
      <AspectTxsContent txsQuery={ txsQuery }/>
    </>
  );
};

export default AspectTxs;
