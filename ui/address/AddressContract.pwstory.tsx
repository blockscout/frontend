import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import useContractTabs from 'lib/hooks/useContractTabs';
import getQueryParamString from 'lib/router/getQueryParamString';

import AddressContract from './AddressContract';

const AddressContractPwStory = () => {
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);
  const addressQuery = useApiQuery('address', { pathParams: { hash } });
  const { tabs } = useContractTabs(addressQuery.data, false);
  return <AddressContract tabs={ tabs } shouldRender={ true } isLoading={ false }/>;
};

export default AddressContractPwStory;
