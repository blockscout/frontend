import React from 'react';

import type { MethodType, SmartContractMethod } from './types';

import ContractConnectWallet from './ContractConnectWallet';
import ContractMethods from './ContractMethods';

interface Props {
  abi: Array<SmartContractMethod>;
  isLoading?: boolean;
  type: MethodType;
}

const ContractMethodsRegular = ({ abi, isLoading, type }: Props) => {

  return (
    <>
      <ContractConnectWallet isLoading={ isLoading }/>
      <ContractMethods abi={ abi } isLoading={ isLoading } type={ type }/>
    </>
  );
};

export default React.memo(ContractMethodsRegular);
