import { useRouter } from 'next/router';
import React from 'react';

import type { Address } from 'types/api/address';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import useSocketChannel from 'lib/socket/useSocketChannel';
import * as stubs from 'stubs/contract';
import ContractDetails from 'ui/address/contract/ContractDetails';
import ContractMethodsCustom from 'ui/address/contract/methods/ContractMethodsCustom';
import ContractMethodsMudSystem from 'ui/address/contract/methods/ContractMethodsMudSystem';
import ContractMethodsProxy from 'ui/address/contract/methods/ContractMethodsProxy';
import ContractMethodsRegular from 'ui/address/contract/methods/ContractMethodsRegular';
import { enrichWithMethodId, isMethod } from 'ui/address/contract/methods/utils';
import ContentLoader from 'ui/shared/ContentLoader';

import type { CONTRACT_MAIN_TAB_IDS } from './utils';
import { CONTRACT_DETAILS_TAB_IDS, CONTRACT_TAB_IDS } from './utils';

interface ContractTab {
  id: typeof CONTRACT_MAIN_TAB_IDS[number] | Array<typeof CONTRACT_MAIN_TAB_IDS[number]>;
  title: string;
  component: React.JSX.Element;
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

  const methods = React.useMemo(() => contractQuery.data?.abi?.filter(isMethod).map(enrichWithMethodId) ?? [], [ contractQuery.data?.abi ]);

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
        methods.length > 0 && {
          id: [ 'read_write_contract' as const, 'read_contract' as const, 'write_contract' as const ],
          title: 'Read/Write contract',
          component: <ContractMethodsRegular abi={ methods } isLoading={ contractQuery.isPlaceholderData }/>,
        },
        verifiedImplementations.length > 0 && {
          id: [ 'read_write_proxy' as const, 'read_proxy' as const, 'write_proxy' as const ],
          title: 'Read/Write proxy',
          component: <ContractMethodsProxy implementations={ verifiedImplementations } isLoading={ contractQuery.isPlaceholderData }/>,
        },
        config.features.account.isEnabled && {
          id: [ 'read_write_custom_methods' as const, 'read_custom_methods' as const, 'write_custom_methods' as const ],
          title: 'Custom ABI',
          component: <ContractMethodsCustom isLoading={ contractQuery.isPlaceholderData }/>,
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
    data?.hash,
    contractQuery,
    channel,
    methods,
    verifiedImplementations,
    hasMudTab,
    mudSystemsQuery.isPlaceholderData,
    mudSystemsQuery.data?.items,
  ]);
}
