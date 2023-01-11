import { Alert } from '@chakra-ui/react';
import _capitalize from 'lodash/capitalize';
import { useRouter } from 'next/router';
import React from 'react';
import { useSigner } from 'wagmi';

import type { ContractMethodWriteResult } from './types';
import type { SmartContractWriteMethod } from 'types/api/contract';

import config from 'configs/app/config';
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

  const { contract, proxy } = useContractContext();
  const _contract = isProxy ? proxy : contract;

  const handleMethodFormSubmit = React.useCallback(async(item: SmartContractWriteMethod, args: Array<string | Array<string>>) => {
    try {
      if (!_contract) {
        return;
      }

      if (item.type === 'receive') {
        const value = args[0] ? getNativeCoinValue(args[0]) : '0';
        const result = await signer?.sendTransaction({
          to: addressHash,
          value,
        });
        return { hash: result?.hash as string };
      }

      const _args = item.stateMutability === 'payable' ? args.slice(0, -1) : args;
      const value = item.stateMutability === 'payable' ? getNativeCoinValue(args[args.length - 1]) : undefined;
      const methodName = item.type === 'fallback' ? 'fallback' : item.name;

      const result = await _contract[methodName](..._args, {
        gasLimit: 100_000,
        value,
      });

      return { hash: result.hash as string };
    } catch (error) {
      if (error instanceof Error) {
        if ('reason' in error && error.reason === 'underlying network changed') {

          if ('detectedNetwork' in error) {
            const networkName = (error.detectedNetwork as { name: string }).name;
            if (networkName) {
              throw new Error(
                `You connected to ${ _capitalize(networkName) } chain in the wallet, 
                but the current instance of Blockscout is for ${ config.network.name } chain`,
              );
            }
          }

          throw new Error('Wrong network detected, please make sure you are switched to the correct network, and try again');
        }
      }
      throw error;
    }
  }, [ _contract, addressHash, signer ]);

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

  if (data.length === 0) {
    return <span>No public write { isProxy ? 'proxy' : '' } functions were found for this contract.</span>;
  }

  return (
    <>
      <ContractConnectWallet/>
      <ContractMethodsAccordion data={ data } renderContent={ renderContent }/>
    </>
  );
};

export default ContractWrite;
