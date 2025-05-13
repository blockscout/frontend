import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import useContractTabs from 'ui/address/contract/useContractTabs';

import AddressContract from './AddressContract';

const AddressContractPwStory = () => {
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);
  const addressQuery = useApiQuery('general:address', { pathParams: { hash } });
  const { tabs } = useContractTabs(addressQuery.data, false);
  return <AddressContract tabs={ tabs } shouldRender={ true } isLoading={ false }/>;
};

export default AddressContractPwStory;
