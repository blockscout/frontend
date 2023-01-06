import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { SmartContractReadMethod } from 'types/api/contract';

import useApiFetch from 'lib/api/useApiFetch';
import useApiQuery from 'lib/api/useApiQuery';
import ContractMethodsAccordion from 'ui/address/contract/ContractMethodsAccordion';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import ContractMethodCallable from './ContractMethodCallable';
import ContractMethodConstant from './ContractMethodConstant';

const ContractRead = () => {
  const router = useRouter();
  const apiFetch = useApiFetch();

  const addressHash = router.query.id?.toString();

  const { data, isLoading, isError } = useApiQuery('contract_methods_read', {
    pathParams: { id: addressHash },
    queryOptions: {
      enabled: Boolean(router.query.id),
    },
  });

  const contractCaller = React.useCallback(async(item: SmartContractReadMethod, args: Array<string>) => {
    await apiFetch('contract_method_query', {
      pathParams: { id: addressHash },
      fetchParams: {
        method: 'POST',
        body: {
          args,
          method_id: item.method_id,
        },
      },
    });

    return [ [ 'string', 'this is mock' ] ];
  }, [ addressHash, apiFetch ]);

  const renderContent = React.useCallback((item: SmartContractReadMethod, index: number, id: number) => {
    if (item.inputs.length === 0) {
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
        caller={ contractCaller }
      />
    );
  }, [ contractCaller ]);

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (isLoading) {
    return <ContentLoader/>;
  }

  return <ContractMethodsAccordion data={ data } renderContent={ renderContent }/>;
};

export default ContractRead;
