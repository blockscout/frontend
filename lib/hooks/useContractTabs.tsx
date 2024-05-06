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
] as const;

interface ContractTab {
  id: typeof CONTRACT_TAB_IDS[number];
  title: string;
  component: JSX.Element;
}

interface ReturnType {
  tabs: Array<ContractTab>;
  isLoading: boolean;
}

export default function useContractTabs(data: Address | undefined, isPlaceholderData: boolean): ReturnType {
  const [ isQueryEnabled, setIsQueryEnabled ] = React.useState(false);

  const router = useRouter();
  const tab = getQueryParamString(router.query.tab);

  const isEnabled = Boolean(data?.hash) && !isPlaceholderData && CONTRACT_TAB_IDS.concat('contract' as never).includes(tab);

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
    return {
      tabs: [
        {
          id: 'contract_code' as const,
          title: 'Code',
          component: <ContractCode contractQuery={ contractQuery } channel={ channel } addressHash={ data?.hash }/>,
        },
        contractQuery.data?.has_methods_read ?
          { id: 'read_contract' as const, title: 'Read contract', component: <ContractRead isLoading={ contractQuery.isPlaceholderData }/> } :
          undefined,
        contractQuery.data?.has_methods_read_proxy ?
          { id: 'read_proxy' as const, title: 'Read proxy', component: <ContractRead isLoading={ contractQuery.isPlaceholderData }/> } :
          undefined,
        contractQuery.data?.has_custom_methods_read ?
          { id: 'read_custom_methods' as const, title: 'Read custom', component: <ContractRead isLoading={ contractQuery.isPlaceholderData }/> } :
          undefined,
        contractQuery.data?.has_methods_write ?
          { id: 'write_contract' as const, title: 'Write contract', component: <ContractWrite isLoading={ contractQuery.isPlaceholderData }/> } :
          undefined,
        contractQuery.data?.has_methods_write_proxy ?
          { id: 'write_proxy' as const, title: 'Write proxy', component: <ContractWrite isLoading={ contractQuery.isPlaceholderData }/> } :
          undefined,
        contractQuery.data?.has_custom_methods_write ?
          { id: 'write_custom_methods' as const, title: 'Write custom', component: <ContractWrite isLoading={ contractQuery.isPlaceholderData }/> } :
          undefined,
      ].filter(Boolean),
      isLoading: contractQuery.isPlaceholderData,
    };
  }, [ contractQuery, channel, data?.hash ]);
}
