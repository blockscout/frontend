import { Alert, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { SmartContractReadMethod, SmartContractQueryMethodRead } from 'types/api/contract';

import useApiFetch from 'lib/api/useApiFetch';
import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import ContractMethodsAccordion from 'ui/address/contract/ContractMethodsAccordion';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import ContractConnectWallet from './ContractConnectWallet';
import ContractCustomAbiAlert from './ContractCustomAbiAlert';
import ContractImplementationAddress from './ContractImplementationAddress';
import ContractMethodCallable from './ContractMethodCallable';
import ContractMethodConstant from './ContractMethodConstant';
import ContractReadResult from './ContractReadResult';
import useWatchAccount from './useWatchAccount';

const ContractRead = () => {
  const apiFetch = useApiFetch();
  const account = useWatchAccount();
  const router = useRouter();

  const tab = getQueryParamString(router.query.tab);
  const addressHash = getQueryParamString(router.query.hash);
  const isProxy = tab === 'read_proxy';
  const isCustomAbi = tab === 'read_custom_methods';

  const { data, isPending, isError } = useApiQuery(isProxy ? 'contract_methods_read_proxy' : 'contract_methods_read', {
    pathParams: { hash: addressHash },
    queryParams: {
      is_custom_abi: isCustomAbi ? 'true' : 'false',
      from: account?.address,
    },
    queryOptions: {
      enabled: Boolean(addressHash),
    },
  });

  const handleMethodFormSubmit = React.useCallback(async(item: SmartContractReadMethod, args: Array<string | Array<unknown>>) => {
    return apiFetch<'contract_method_query', SmartContractQueryMethodRead>('contract_method_query', {
      pathParams: { hash: addressHash },
      queryParams: {
        is_custom_abi: isCustomAbi ? 'true' : 'false',
      },
      fetchParams: {
        method: 'POST',
        body: {
          args,
          method_id: item.method_id,
          contract_type: isProxy ? 'proxy' : 'regular',
          from: account?.address,
        },
      },
    });
  }, [ account?.address, addressHash, apiFetch, isCustomAbi, isProxy ]);

  const renderItemContent = React.useCallback((item: SmartContractReadMethod, index: number, id: number) => {
    if (item.error) {
      return <Alert status="error" fontSize="sm" wordBreak="break-word">{ item.error }</Alert>;
    }

    if (item.outputs?.some(({ value }) => value !== undefined && value !== null)) {
      return (
        <Flex flexDir="column" rowGap={ 1 }>
          { item.outputs.map((output, index) => <ContractMethodConstant key={ index } data={ output }/>) }
        </Flex>
      );
    }

    return (
      <ContractMethodCallable
        key={ id + '_' + index }
        data={ item }
        onSubmit={ handleMethodFormSubmit }
        resultComponent={ ContractReadResult }
      />
    );
  }, [ handleMethodFormSubmit ]);

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (isPending) {
    return <ContentLoader/>;
  }

  if (data.length === 0 && !isProxy) {
    return <span>No public read functions were found for this contract.</span>;
  }

  return (
    <>
      { isCustomAbi && <ContractCustomAbiAlert/> }
      { account && <ContractConnectWallet/> }
      { isProxy && <ContractImplementationAddress hash={ addressHash }/> }
      <ContractMethodsAccordion data={ data } addressHash={ addressHash } renderItemContent={ renderItemContent } tab={ tab }/>
    </>
  );
};

export default React.memo(ContractRead);
