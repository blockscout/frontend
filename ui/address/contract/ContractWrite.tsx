import { useRouter } from 'next/router';
import React from 'react';

import type { SmartContractWriteMethod } from 'types/api/contract';

import useApiQuery from 'lib/api/useApiQuery';
import ContractMethodsAccordion from 'ui/address/contract/ContractMethodsAccordion';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import { useContractContext } from './context';
import ContractConnectWallet from './ContractConnectWallet';
import ContractMethodCallable from './ContractMethodCallable';

interface Props {
  isProxy?: boolean;
}

const ContractWrite = ({ isProxy }: Props) => {
  const router = useRouter();

  const addressHash = router.query.id?.toString();

  const { data, isLoading, isError } = useApiQuery(isProxy ? 'contract_methods_write_proxy' : 'contract_methods_write', {
    pathParams: { id: addressHash },
    queryOptions: {
      enabled: Boolean(addressHash),
    },
  });

  const contract = useContractContext();

  const contractCaller = React.useCallback(async(item: SmartContractWriteMethod, args: Array<string>) => {
    if (!contract) {
      return;
    }

    if (item.type === 'fallback') {
      return;
    }

    const methodName = item.name;
    const result = await contract[methodName](...args, {
      gasLimit: 100_000,
    });

    // eslint-disable-next-line no-console
    console.log('__>__', { result });

    return [ [ 'string', 'this is mock' ] ];
  }, [ contract ]);

  const renderContent = React.useCallback((item: SmartContractWriteMethod, index: number, id: number) => {
    return (
      <ContractMethodCallable
        key={ id + '_' + index }
        data={ item }
        caller={ contractCaller }
        isWrite
      />
    );
  }, [ contractCaller ]);

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

export default ContractWrite;
