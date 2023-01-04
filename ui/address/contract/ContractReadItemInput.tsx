import React from 'react';

import type { SmartContractMethodInput } from 'types/api/contract';

interface Props {
  data: Array<SmartContractMethodInput>;
}

const ContractReadItemInput = ({ data }: Props) => {
  return <span>{ data.map(({ type }) => type).join(', ') }</span>;
};

export default ContractReadItemInput;
