import React from 'react';
import { useWaitForTransaction } from 'wagmi';

import type { ResultComponentProps } from './methodForm/types';
import type { ContractMethodWriteResult } from './types';
import type { SmartContractWriteMethod } from 'types/api/contract';

import ContractWriteResultDumb from './ContractWriteResultDumb';

const ContractWriteResult = ({ result, onSettle }: ResultComponentProps<SmartContractWriteMethod>) => {
  const txHash = result && 'hash' in result ? result.hash as `0x${ string }` : undefined;
  const txInfo = useWaitForTransaction({
    hash: txHash,
  });

  return <ContractWriteResultDumb result={ result as ContractMethodWriteResult } onSettle={ onSettle } txInfo={ txInfo }/>;
};

export default React.memo(ContractWriteResult) as typeof ContractWriteResult;
