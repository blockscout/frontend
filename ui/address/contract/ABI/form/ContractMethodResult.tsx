import React from 'react';

import type { FormSubmitResult, ContractAbiItem } from '../types';

import ContractMethodResultApi from './ContractMethodResultApi';
import ContractMethodResultWalletClient from './ContractMethodResultWalletClient';

interface Props {
  abiItem: ContractAbiItem;
  result: FormSubmitResult;
  onSettle: () => void;
}

const ContractMethodResult = ({ result, abiItem, onSettle }: Props) => {

  switch (result.source) {
    case 'api':
      return <ContractMethodResultApi item={ abiItem } result={ result.result } onSettle={ onSettle }/>;

    case 'wallet_client':
      return <ContractMethodResultWalletClient result={ result.result } onSettle={ onSettle }/>;

    default: {
      return null;
    }
  }
};

export default React.memo(ContractMethodResult);
