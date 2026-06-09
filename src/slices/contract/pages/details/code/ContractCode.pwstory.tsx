// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';

import useApiQuery from 'src/api/hooks/useApiQuery';
import useSocketChannel from 'src/api/socket/useSocketChannel';

import getQueryParamString from 'src/shared/router/get-query-param-string';

import useContractTabs from '../useContractTabs';

const ContractDetails = () => {
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);
  const addressQuery = useApiQuery('core:address', { pathParams: { hash } });
  const channel = useSocketChannel({
    topic: `addresses:${ hash?.toLowerCase() }`,
    isDisabled: !addressQuery.data,
  });

  const { tabs } = useContractTabs({
    addressData: addressQuery.data,
    isEnabled: true,
    channel,
  });
  const content = tabs.find(({ id }) => id === 'contract_code')?.component;
  return content ?? null;
};

export default ContractDetails;
