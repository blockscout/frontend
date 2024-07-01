import { type UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { AspectDetail as TAspectDetail } from '../../types/api/aspect';

import type { ResourceError } from '../../lib/api/resources';
import getQueryParamString from '../../lib/router/getQueryParamString';
import { BINDING } from '../../stubs/aspect';
import { generateListStub } from '../../stubs/utils';
import ActionBar from '../shared/ActionBar';
import Pagination from '../shared/pagination/Pagination';
import useQueryWithPages from '../shared/pagination/useQueryWithPages';
import BindingsContent from './BindingsContent';

type Props = {
  scrollRef?: React.RefObject<HTMLDivElement>;
  aspectQuery?: UseQueryResult<TAspectDetail, ResourceError>;
}

const AspectBindings = ({ scrollRef }: Props) => {
  const router = useRouter();

  const currentAddress = getQueryParamString(router.query.hash);

  const bindingsQuery = useQueryWithPages({
    resourceName: 'bound_addresses',
    pathParams: { hash: currentAddress },
    scrollRef,
    options: {
      placeholderData: generateListStub<'bound_addresses'>(BINDING, 50, { next_page_params: {
        block_number: 9005713,
        index: 5,
        items_count: 50,
      } }),
    },
  });

  return (
    <>
      <ActionBar mt={ -6 } justifyContent="flex-end">
        <Pagination { ...bindingsQuery.pagination } isVisible ml={ 8 }/>
      </ActionBar>
      <BindingsContent bindingsQuery={ bindingsQuery }/>
    </>
  );
};

export default AspectBindings;
