import { useRouter } from 'next/router';
import React from 'react';

import type { SmartContractWriteMethod } from 'types/api/contract';

import useApiQuery from 'lib/api/useApiQuery';
import ContractMethodsAccordion from 'ui/address/contract/ContractMethodsAccordion';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import ContractMethodCallable from './ContractMethodCallable';

const ContractWrite = () => {
  const router = useRouter();

  const addressHash = router.query.id?.toString();

  const { data, isLoading, isError } = useApiQuery('contract_methods_write', {
    pathParams: { id: addressHash },
    queryOptions: {
      enabled: Boolean(router.query.id),
    },
  });

  const contractInfo = useApiQuery('contract', {
    pathParams: { id: addressHash },
    queryOptions: {
      enabled: Boolean(router.query.id),
    },
  });

  const contractCaller = React.useCallback(async() => {
    // eslint-disable-next-line no-console
    console.log('__>__', contractInfo);
    return [ [ 'string', 'this is mock' ] ];
  }, [ contractInfo ]);

  const renderContent = React.useCallback((item: SmartContractWriteMethod, index: number, id: number) => {
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

export default ContractWrite;
