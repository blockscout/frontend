import { useRouter } from 'next/router';

import useApiQuery from 'lib/api/useApiQuery';
import useContractTabs from 'lib/hooks/useContractTabs';
import getQueryParamString from 'lib/router/getQueryParamString';

const ContractCode = () => {
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);
  const addressQuery = useApiQuery('address', { pathParams: { hash } });
  const { tabs } = useContractTabs(addressQuery.data, false);
  const content = tabs.find(({ id }) => id === 'contract_code')?.component;
  return content ?? null;
};

export default ContractCode;
