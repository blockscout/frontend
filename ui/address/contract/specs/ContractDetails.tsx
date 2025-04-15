import { useRouter } from 'next/router';

import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';

import useContractTabs from '../useContractTabs';

const ContractDetails = () => {
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);
  const addressQuery = useApiQuery('address', { pathParams: { hash } });
  const { tabs } = useContractTabs({ addressData: addressQuery.data, isEnabled: true, channel: undefined });
  const content = tabs.find(({ id }) => id === 'contract_code')?.component;
  return content ?? null;
};

export default ContractDetails;
