import { useRouter } from 'next/router';
import React from 'react';

import type { Address } from 'types/api/address';

import useApiQuery from 'lib/api/useApiQuery';
import * as cookies from 'lib/cookies';
import getQueryParamString from 'lib/router/getQueryParamString';
import useSocketChannel from 'lib/socket/useSocketChannel';
import * as stubs from 'stubs/contract';
import ContractDetails from 'ui/address/contract/ContractDetails';
import ContractMethodsCustom from 'ui/address/contract/methods/ContractMethodsCustom';
import ContractMethodsMudSystem from 'ui/address/contract/methods/ContractMethodsMudSystem';
import ContractMethodsProxy from 'ui/address/contract/methods/ContractMethodsProxy';
import ContractMethodsRegular from 'ui/address/contract/methods/ContractMethodsRegular';
import { divideAbiIntoMethodTypes } from 'ui/address/contract/methods/utils';
import ContentLoader from 'ui/shared/ContentLoader';

import type { CONTRACT_MAIN_TAB_IDS } from './utils';
import { CONTRACT_DETAILS_TAB_IDS, CONTRACT_TAB_IDS } from './utils';

interface ContractTab {
  id: typeof CONTRACT_MAIN_TAB_IDS[number];
  title: string;
  component: JSX.Element;
  subTabs?: Array<string>;
}

interface ReturnType {
  tabs: Array<ContractTab>;
  isLoading: boolean;
}

export default function useContractTabs(data: Address | undefined, isPlaceholderData: boolean, hasMudTab?: boolean): ReturnType {
  const [ isQueryEnabled, setIsQueryEnabled ] = React.useState(false);

  const router = useRouter();
  const tab = getQueryParamString(router.query.tab);

  const isEnabled = Boolean(data?.hash) && data?.is_contract && !isPlaceholderData && CONTRACT_TAB_IDS.concat('contract' as never).includes(tab);

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

  const mudSystemsQuery = useApiQuery('contract_mud_systems', {
    pathParams: { hash: data?.hash },
    queryOptions: {
      enabled: isEnabled && isQueryEnabled && hasMudTab,
      refetchOnMount: false,
      placeholderData: stubs.MUD_SYSTEMS,
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
    return data?.implementations?.filter(({ name, address }) => name && address && address !== data?.hash) || [];
  }, [ data?.hash, data?.implementations ]);

  return React.useMemo(() => {
    return {
      tabs: [
        data?.hash && {
          id: 'contract_code' as const,
          title: 'Code',
          component: <ContractDetails mainContractQuery={ contractQuery } channel={ channel } addressHash={ data.hash }/>,
          subTabs: CONTRACT_DETAILS_TAB_IDS as unknown as Array<string>,
        },
        methods.read.length > 0 && {
          id: 'read_contract' as const,
          title: 'Read contract',
          component: <ContractMethodsRegular type="read" abi={ methods.read } isLoading={ contractQuery.isPlaceholderData }/>,
        },
        methodsCustomAbi.read.length > 0 && {
          id: 'read_custom_methods' as const,
          title: 'Read custom',
          component: <ContractMethodsCustom type="read" abi={ methodsCustomAbi.read } isLoading={ contractQuery.isPlaceholderData }/>,
        },
        verifiedImplementations.length > 0 && {
          id: 'read_proxy' as const,
          title: 'Read proxy',
          component: (
            <ContractMethodsProxy
              type="read"
              implementations={ verifiedImplementations }
              isLoading={ contractQuery.isPlaceholderData }
            />
          ),
        },
        methods.write.length > 0 && {
          id: 'write_contract' as const,
          title: 'Write contract',
          component: <ContractMethodsRegular type="write" abi={ methods.write } isLoading={ contractQuery.isPlaceholderData }/>,
        },
        methodsCustomAbi.write.length > 0 && {
          id: 'write_custom_methods' as const,
          title: 'Write custom',
          component: <ContractMethodsCustom type="write" abi={ methodsCustomAbi.write } isLoading={ contractQuery.isPlaceholderData }/>,
        },
        verifiedImplementations.length > 0 && {
          id: 'write_proxy' as const,
          title: 'Write proxy',
          component: (
            <ContractMethodsProxy
              type="write"
              implementations={ verifiedImplementations }
              isLoading={ contractQuery.isPlaceholderData }
            />
          ),
        },
        hasMudTab && {
          id: 'mud_system' as const,
          title: 'MUD System',
          component: mudSystemsQuery.isPlaceholderData ?
            <ContentLoader/> :
            <ContractMethodsMudSystem items={ mudSystemsQuery.data?.items ?? [] }/>,
        },
      ].filter(Boolean),
      isLoading: contractQuery.isPlaceholderData,
    };
  }, [
    contractQuery,
    channel,
    data?.hash,
    methods.read,
    methods.write,
    methodsCustomAbi.read,
    methodsCustomAbi.write,
    verifiedImplementations,
    mudSystemsQuery,
    hasMudTab,
  ]);
}
