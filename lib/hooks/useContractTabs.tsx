import { useRouter } from 'next/router';
import React from 'react';

import type { Address } from 'types/api/address';

import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import useSocketChannel from 'lib/socket/useSocketChannel';
import * as stubs from 'stubs/contract';
import ContractCode from 'ui/address/contract/ContractCode';
import ContractRead from 'ui/address/contract/ContractRead';
import ContractWrite from 'ui/address/contract/ContractWrite';

const CONTRACT_TAB_IDS = [
  'contract_code',
  'read_contract',
  'read_proxy',
  'read_custom_methods',
  'write_contract',
  'write_proxy',
  'write_custom_methods',
];

const EMPTY_ARRAY: Array<never> = [];

interface ContractTab {
  id: typeof CONTRACT_TAB_IDS[number];
  title: string;
  component: JSX.Element;
}

export default function useContractTabs(data: Address | undefined): Array<ContractTab> {
  const [ isQueryEnabled, setIsQueryEnabled ] = React.useState(false);

  const router = useRouter();
  const tab = getQueryParamString(router.query.tab);

  const isEnabled = Boolean(data?.hash) && CONTRACT_TAB_IDS.concat('contract').includes(tab);

  const enableQuery = React.useCallback(() => {
    setIsQueryEnabled(true);
  }, []);

  const contractQuery = useApiQuery('contract', {
    pathParams: { hash: data?.hash },
    queryOptions: {
      enabled: isEnabled && isQueryEnabled,
      refetchOnMount: false,
      placeholderData: data?.is_verified ? stubs.CONTRACT_CODE_VERIFIED : stubs.CONTRACT_CODE_UNVERIFIED,
    },
  });

  const channel = useSocketChannel({
    topic: `addresses:${ data?.hash?.toLowerCase() }`,
    isDisabled: !isEnabled,
    onJoin: enableQuery,
    onSocketError: enableQuery,
  });

  return React.useMemo(() => {
    if (!isEnabled) {
      return EMPTY_ARRAY;
    }

    return [
      {
        id: 'contact_code',
        title: 'Code',
        component: <ContractCode contractQuery={ contractQuery } channel={ channel } addressHash={ data?.hash }/>,
      },
      contractQuery.data?.has_methods_read ?
        { id: 'read_contract', title: 'Read contract', component: <ContractRead/> } :
        undefined,
      contractQuery.data?.has_methods_read_proxy ?
        { id: 'read_proxy', title: 'Read proxy', component: <ContractRead/> } :
        undefined,
      contractQuery.data?.has_custom_methods_read ?
        { id: 'read_custom_methods', title: 'Read custom', component: <ContractRead/> } :
        undefined,
      contractQuery.data?.has_methods_write ?
        { id: 'write_contract', title: 'Write contract', component: <ContractWrite/> } :
        undefined,
      contractQuery.data?.has_methods_write_proxy ?
        { id: 'write_proxy', title: 'Write proxy', component: <ContractWrite/> } :
        undefined,
      contractQuery.data?.has_custom_methods_write ?
        { id: 'write_custom_methods', title: 'Write custom', component: <ContractWrite/> } :
        undefined,
    ].filter(Boolean);
  }, [ isEnabled, contractQuery, channel, data?.hash ]);
}
