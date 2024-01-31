import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { SmartContractMethodInput, SmartContractWriteMethod } from 'types/api/contract';

import config from 'configs/app';

import { ARRAY_REGEXP } from '../utils';
import ContractMethodFieldInput from './ContractMethodFieldInput';
import ContractMethodFieldInputArray from './ContractMethodFieldInputArray';
import ContractMethodFieldInputTuple from './ContractMethodFieldInputTuple';

interface Props {
  data: SmartContractWriteMethod;
}

const ContractMethodForm = ({ data }: Props) => {

  const inputs: Array<SmartContractMethodInput> = React.useMemo(() => {
    return [
      ...('inputs' in data ? data.inputs : []),
      ...('stateMutability' in data && data.stateMutability === 'payable' ? [ {
        name: `Send native ${ config.chain.currency.symbol || 'coin' }`,
        type: 'uint256' as const,
        internalType: 'uint256' as const,
        fieldType: 'native_coin' as const,
      } ] : []),
    ];
  }, [ data ]);

  return (
    <Flex flexDir="column" rowGap={ 3 }>
      { inputs.map((input, index) => {
        if (input.components && input.type === 'tuple') {
          return <ContractMethodFieldInputTuple key={ index } data={ input }/>;
        }

        const arrayMatch = input.type.match(ARRAY_REGEXP);
        if (arrayMatch) {
          return <ContractMethodFieldInputArray key={ index } data={ input }/>;
        }

        return <ContractMethodFieldInput key={ index } data={ input }/>;
      }) }
    </Flex>
  );
};

export default ContractMethodForm;
