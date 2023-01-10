import { Alert, Box, chakra, Flex, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useAccount } from 'wagmi';

import type { ContractMethodReadResult } from './types';
import type { SmartContractReadMethod, SmartContractQueryMethodRead } from 'types/api/contract';

import useApiFetch from 'lib/api/useApiFetch';
import useApiQuery from 'lib/api/useApiQuery';
import ContractMethodsAccordion from 'ui/address/contract/ContractMethodsAccordion';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import ContractConnectWallet from './ContractConnectWallet';
import ContractMethodCallable from './ContractMethodCallable';
import ContractMethodConstant from './ContractMethodConstant';

interface Props {
  isProxy?: boolean;
}

const ContractRead = ({ isProxy }: Props) => {
  const router = useRouter();
  const apiFetch = useApiFetch();
  const { address: userAddress } = useAccount();

  const addressHash = router.query.id?.toString();

  const { data, isLoading, isError } = useApiQuery(isProxy ? 'contract_methods_read_proxy' : 'contract_methods_read', {
    pathParams: { id: addressHash },
    queryOptions: {
      enabled: Boolean(router.query.id),
    },
  });

  const handleMethodFormSubmit = React.useCallback(async(item: SmartContractReadMethod, args: Array<string>) => {
    return apiFetch<'contract_method_query', SmartContractQueryMethodRead>('contract_method_query', {
      pathParams: { id: addressHash },
      fetchParams: {
        method: 'POST',
        body: {
          args,
          method_id: item.method_id,
          contract_type: isProxy ? 'proxy' : 'regular',
          from: userAddress,
        },
      },
    });
  }, [ addressHash, apiFetch, isProxy, userAddress ]);

  const resultBgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  const renderResult = React.useCallback((item: SmartContractReadMethod, result: ContractMethodReadResult) => {
    if ('status' in result) {
      return <Alert status="error" mt={ 3 } p={ 4 } borderRadius="md" fontSize="sm">{ result.statusText }</Alert>;
    }

    if (result.is_error) {
      const message = 'error' in result.result ? result.result.error : result.result.message;
      return <Alert status="error" mt={ 3 } p={ 4 } borderRadius="md" fontSize="sm">{ message }</Alert>;
    }

    return (
      <Box mt={ 3 } p={ 4 } borderRadius="md" bgColor={ resultBgColor } fontSize="sm">
        <p>
          [ <chakra.span fontWeight={ 600 }>{ 'name' in item ? item.name : '' }</chakra.span> method response ]
        </p>
        <p>[</p>
        { result.result.output.map(({ type, value }, index) => (
          <chakra.p key={ index } whiteSpace="break-spaces" wordBreak="break-all">  { type }: { String(value) }</chakra.p>
        )) }
        <p>]</p>
      </Box>
    );
  }, [ resultBgColor ]);

  const renderContent = React.useCallback((item: SmartContractReadMethod, index: number, id: number) => {
    if (item.error) {
      return <Alert status="error" fontSize="sm">{ item.error }</Alert>;
    }

    if (item.outputs.some(({ value }) => value)) {
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
        renderResult={ renderResult }
      />
    );
  }, [ handleMethodFormSubmit, renderResult ]);

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (isLoading) {
    return <ContentLoader/>;
  }

  return (
    <>
      <ContractConnectWallet/>
      <ContractMethodsAccordion data={ data } renderContent={ renderContent }/>
    </>
  );
};

export default React.memo(ContractRead);
