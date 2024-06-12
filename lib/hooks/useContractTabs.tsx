import { useRouter } from 'next/router';
import React from 'react';

import type { Address } from 'types/api/address';

import useApiQuery from 'lib/api/useApiQuery';
import * as cookies from 'lib/cookies';
import getQueryParamString from 'lib/router/getQueryParamString';
import useSocketChannel from 'lib/socket/useSocketChannel';
import * as stubs from 'stubs/contract';
import ContractCode from 'ui/address/contract/ContractCode';
import ContractMethods from 'ui/address/contract/ContractMethods';
import ContractMethodsProxy from 'ui/address/contract/ContractMethodsProxy';
// TODO @tom2drum remove these components
// import ContractRead from 'ui/address/contract/ContractRead';
// import ContractWrite from 'ui/address/contract/ContractWrite';
import { divideAbiIntoMethodTypes } from 'ui/address/contract/utils';

const CONTRACT_TAB_IDS = [
  'contract_code',
  'read_contract',
  'read_contract_rpc',
  'read_proxy',
  'read_custom_methods',
  'write_contract',
  'write_contract_rpc',
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

  const customAbiQuery = useApiQuery('custom_abi', {
    queryOptions: {
      enabled: isEnabled && isQueryEnabled && Boolean(cookies.get(cookies.NAMES.API_TOKEN)),
      refetchOnMount: false,
    },
  });

  const channel = useSocketChannel({
    topic: `addresses:${ data?.hash?.toLowerCase() }`,
    isDisabled: !isEnabled,
    onJoin: enableQuery,
    onSocketError: enableQuery,
  });

  const methods = React.useMemo(() => divideAbiIntoMethodTypes(contractQuery.data?.abi ?? []), [ contractQuery.data?.abi ]);
  const methodsCustomAbi = React.useMemo(() => {
    return divideAbiIntoMethodTypes(
      customAbiQuery.data
        ?.find((item) => data && item.contract_address_hash.toLowerCase() === data.hash.toLowerCase())
        ?.abi ??
        [],
    );
  }, [ customAbiQuery.data, data ]);

  const verifiedImplementations = React.useMemo(() => {
    return data?.implementations?.filter(({ name }) => name) || [];
  }, [ data?.implementations ]);

  return React.useMemo(() => {
    return {
      tabs: [
        {
          id: 'contract_code' as const,
          title: 'Code',
          component: <ContractCode contractQuery={ contractQuery } channel={ channel } addressHash={ data?.hash }/>,
        },
        methods.read.length > 0 && {
          id: 'read_contract' as const,
          title: 'Read contract',
          component: <ContractMethods data={ methods.read } isLoading={ contractQuery.isPlaceholderData } type="read"/>,
        },
        methodsCustomAbi.read.length > 0 && {
          id: 'read_custom_methods' as const,
          title: 'Read custom',
          component: <ContractMethods data={ methodsCustomAbi.read } isLoading={ contractQuery.isPlaceholderData } type="read"/>,
        },
        verifiedImplementations.length > 0 && {
          id: 'read_proxy' as const,
          title: 'Read proxy',
          component: <ContractMethodsProxy type="read" implementations={ verifiedImplementations } addressHash={ data?.hash }/>,
        },
        methods.write.length > 0 && {
          id: 'write_contract' as const,
          title: 'Write contract',
          component: <ContractMethods data={ methods.write } isLoading={ contractQuery.isPlaceholderData } type="write"/>,
        },
        methodsCustomAbi.write.length > 0 && {
          id: 'write_custom_methods' as const,
          title: 'Write custom',
          component: <ContractMethods data={ methodsCustomAbi.write } isLoading={ contractQuery.isPlaceholderData } type="write"/>,
        },
        verifiedImplementations.length > 0 && {
          id: 'write_proxy' as const,
          title: 'Write proxy',
          component: <ContractMethodsProxy type="write" implementations={ verifiedImplementations } addressHash={ data?.hash }/>,
        },
      ].filter(Boolean),
      isLoading: contractQuery.isPlaceholderData,
    };
  }, [ contractQuery, channel, data?.hash, verifiedImplementations, methods.read, methods.write, methodsCustomAbi.read, methodsCustomAbi.write ]);
}
