import { Alert } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { useSigner } from 'wagmi';

import type { ContractMethodWriteResult } from './types';
import type { SmartContractWriteMethod } from 'types/api/contract';

import useApiQuery from 'lib/api/useApiQuery';
import ContractMethodsAccordion from 'ui/address/contract/ContractMethodsAccordion';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import { useContractContext } from './context';
import ContractConnectWallet from './ContractConnectWallet';
import ContractMethodCallable from './ContractMethodCallable';
import ContractWriteResult from './ContractWriteResult';
import { getNativeCoinValue } from './utils';

interface Props {
  isProxy?: boolean;
}

const ContractWrite = ({ isProxy }: Props) => {
  const router = useRouter();

  const addressHash = router.query.id?.toString();
  const { data: signer } = useSigner();

  const { data, isLoading, isError } = useApiQuery(isProxy ? 'contract_methods_write_proxy' : 'contract_methods_write', {
    pathParams: { id: addressHash },
    queryOptions: {
      enabled: Boolean(addressHash),
    },
  });

  const contract = useContractContext();

  const handleMethodFormSubmit = React.useCallback(async(item: SmartContractWriteMethod, args: Array<string | Array<string>>) => {
    if (!contract) {
      return;
    }

    if (item.type === 'fallback' || item.type === 'receive') {
      const value = args[0] ? getNativeCoinValue(args[0]) : '0';
      const result = await signer?.sendTransaction({
        to: addressHash,
        value,
      });
      return { hash: result?.hash as string };
    }

    const _args = item.stateMutability === 'payable' ? args.slice(0, -1) : args;
    const value = item.stateMutability === 'payable' ? getNativeCoinValue(args[args.length - 1]) : undefined;
    const methodName = item.name;

    const result = await contract[methodName](..._args, {
      gasLimit: 100_000,
      value,
    });

    return { hash: result.hash as string };
  }, [ addressHash, contract, signer ]);

  const renderResult = React.useCallback((item: SmartContractWriteMethod, result: ContractMethodWriteResult) => {
    if (!result || 'message' in result) {
      return (
        <Alert status="error" mt={ 3 } p={ 4 } borderRadius="md" fontSize="sm" wordBreak="break-all">
          { result ? result.message : 'No result' }
        </Alert>
      );
    }

    return <ContractWriteResult hash={ result.hash as `0x${ string }` }/>;
  }, []);

  const renderContent = React.useCallback((item: SmartContractWriteMethod, index: number, id: number) => {
    return (
      <ContractMethodCallable
        key={ id + '_' + index }
        data={ item }
        onSubmit={ handleMethodFormSubmit }
        renderResult={ renderResult }
        isWrite
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

export default ContractWrite;
