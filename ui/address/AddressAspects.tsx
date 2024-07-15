import { useRouter } from 'next/router';
import React from 'react';

import getQueryParamString from 'lib/router/getQueryParamString';
import { ADDRESS_ASPECTS } from 'stubs/address';
import { generateListStub } from 'stubs/utils';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import ActionBar from '../shared/ActionBar';
import Pagination from '../shared/pagination/Pagination';
import AddressAspectsHistory from './aspects/AddressAspectsHistory';

type Props = {
  scrollRef?: React.RefObject<HTMLDivElement>;
}

const AddressAspects = ({ scrollRef }: Props) => {
  const router = useRouter();

  const currentAddress = getQueryParamString(router.query.hash);

  const addressAspectQuery = useQueryWithPages({
    resourceName: 'address_aspects',
    pathParams: { address: currentAddress },
    scrollRef,
    options: {
      placeholderData: generateListStub<'address_aspects'>(
        ADDRESS_ASPECTS,
        50,
        {
          next_page_params: {
            block_number: 8009880,
            items_count: 50,
          },
        },
      ),
    },
  });

  return (
    <>
      <ActionBar mt={ -6 } justifyContent="flex-end">
        <Pagination { ...addressAspectQuery.pagination } isVisible ml={ 8 }/>
      </ActionBar>
      <AddressAspectsHistory query={ addressAspectQuery }/>
    </>

  );
};

export default React.memo(AddressAspects);
