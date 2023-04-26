import React from 'react';
import { useAccount, useSigner, useNetwork, useSwitchNetwork } from 'wagmi';

import type { SmartContractWriteMethod } from 'types/api/contract';

import config from 'configs/app/config';
import useApiQuery from 'lib/api/useApiQuery';
import ContractMethodsAccordion from 'ui/address/contract/ContractMethodsAccordion';
import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import { useContractContext } from './context';
import ContractConnectWallet from './ContractConnectWallet';
import ContractCustomAbiAlert from './ContractCustomAbiAlert';
import ContractImplementationAddress from './ContractImplementationAddress';
import ContractMethodCallable from './ContractMethodCallable';
import ContractWriteResult from './ContractWriteResult';
import { getNativeCoinValue } from './utils';

interface Props {
  addressHash?: string;
  isProxy?: boolean;
  isCustomAbi?: boolean;
}

const ContractWrite = ({ addressHash, isProxy, isCustomAbi }: Props) => {
  const { data: signer } = useSigner();
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();

  const { data, isLoading, isError } = useApiQuery(isProxy ? 'contract_methods_write_proxy' : 'contract_methods_write', {
    pathParams: { hash: addressHash },
    queryParams: {
      is_custom_abi: isCustomAbi ? 'true' : 'false',
    },
    queryOptions: {
      enabled: Boolean(addressHash),
    },
  });

  const { contract, proxy, custom } = useContractContext();
  const _contract = (() => {
    if (isProxy) {
      return proxy;
    }

    if (isCustomAbi) {
      return custom;
    }

    return contract;
  })();

  const handleMethodFormSubmit = React.useCallback(async(item: SmartContractWriteMethod, args: Array<string | Array<unknown>>) => {
    if (!isConnected) {
      throw new Error('Wallet is not connected');
    }

    if (chain?.id && String(chain.id) !== config.network.id) {
      await switchNetworkAsync?.(Number(config.network.id));
    }

    if (!_contract) {
      throw new Error('Something went wrong. Try again later.');
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
  }, [ _contract, addressHash, chain, isConnected, signer, switchNetworkAsync ]);

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
