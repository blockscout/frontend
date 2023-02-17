import _capitalize from 'lodash/capitalize';
import { useRouter } from 'next/router';
import React from 'react';
import { useAccount, useSigner } from 'wagmi';

import type { SmartContractWriteMethod } from 'types/api/contract';

import config from 'configs/app/config';
import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import ContractMethodsAccordion from 'ui/address/contract/ContractMethodsAccordion';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import { useContractContext } from './context';
import ContractConnectWallet from './ContractConnectWallet';
import ContractCustomAbiAlert from './ContractCustomAbiAlert';
import ContractImplementationAddress from './ContractImplementationAddress';
import ContractMethodCallable from './ContractMethodCallable';
import ContractWriteResult from './ContractWriteResult';
import { getNativeCoinValue, isExtendedError } from './utils';

interface Props {
  isProxy?: boolean;
  isCustomAbi?: boolean;
}

const ContractWrite = ({ isProxy, isCustomAbi }: Props) => {
  const router = useRouter();

  const addressHash = getQueryParamString(router.query.hash);
  const { data: signer } = useSigner();
  const { isConnected } = useAccount();

  const { data, isLoading, isError } = useApiQuery(isProxy ? 'contract_methods_write_proxy' : 'contract_methods_write', {
    pathParams: { hash: addressHash },
    queryParams: {
      is_custom_abi: isCustomAbi ? 'true' : 'false',
    },
    queryOptions: {
      enabled: Boolean(addressHash),
    },
  });

  const { contract, proxy } = useContractContext();
  const _contract = isProxy ? proxy : contract;

  const handleMethodFormSubmit = React.useCallback(async(item: SmartContractWriteMethod, args: Array<string | Array<string>>) => {
    if (!isConnected) {
      throw new Error('Wallet is not connected');
    }

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
      if (isExtendedError(error)) {
        if ('reason' in error && error.reason === 'underlying network changed') {

          if ('detectedNetwork' in error && typeof error.detectedNetwork === 'object' && error.detectedNetwork !== null) {
            const networkName = error.detectedNetwork.name;
            if (networkName) {
              throw new Error(
                // eslint-disable-next-line max-len
                `You connected to ${ _capitalize(networkName) } chain in the wallet, but the current instance of Blockscout is for ${ config.network.name } chain`,
              );
            }
          }

          throw new Error('Wrong network detected, please make sure you are switched to the correct network, and try again');
        }
      }
      throw error;
    }
  }, [ _contract, addressHash, isConnected, signer ]);

  const renderContent = React.useCallback((item: SmartContractWriteMethod, index: number, id: number) => {
    return (
      <ContractMethodCallable
        key={ id + '_' + index }
        data={ item }
        onSubmit={ handleMethodFormSubmit }
        ResultComponent={ ContractWriteResult }
        isWrite
      />
    );
  }, [ handleMethodFormSubmit ]);

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (isLoading) {
    return <ContentLoader/>;
  }

  if (data.length === 0 && !isProxy) {
    return <span>No public write functions were found for this contract.</span>;
  }

  return (
    <>
      { isCustomAbi && <ContractCustomAbiAlert/> }
      <ContractConnectWallet/>
      { isProxy && <ContractImplementationAddress hash={ addressHash }/> }
      <ContractMethodsAccordion data={ data } renderContent={ renderContent }/>
    </>
  );
};

export default React.memo(ContractWrite);
