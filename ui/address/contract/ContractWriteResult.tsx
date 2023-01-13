import React from 'react';
import { useWaitForTransaction } from 'wagmi';

import type { ContractMethodWriteResult } from './types';

import ContractWriteResultDumb from './ContractWriteResultDumb';

interface Props {
  result: ContractMethodWriteResult;
  onSettle: () => void;
}

const ContractWriteResult = ({ result, onSettle }: Props) => {
  const txHash = result && 'hash' in result ? result.hash as `0x${ string }` : undefined;
  const txInfo = useWaitForTransaction({
    hash: txHash,
  });

  return <ContractWriteResultDumb result={ result } onSettle={ onSettle } txInfo={ txInfo }/>;
};

export default React.memo(ContractWriteResult);
