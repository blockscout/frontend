import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { SmartContractQueryMethodSuccess } from 'types/api/contract';

const TUPLE_TYPE_REGEX = /\[(.+)\]/;

interface Props {
  output: SmartContractQueryMethodSuccess['result']['output'][0];
  name: SmartContractQueryMethodSuccess['result']['names'][0];
}

const ContractMethodResultApiItem = ({ output, name }: Props) => {
  if (Array.isArray(name)) {
    const [ structName, argNames ] = name;
    const argTypes = output.type.match(TUPLE_TYPE_REGEX)?.[1].split(',');

    return (
      <>
        <p>
          <chakra.span fontWeight={ 500 }>  { structName }</chakra.span>
          <span> ({ output.type }) :</span>
        </p>
        { argNames.map((argName, argIndex) => {
          return (
            <p key={ argName }>
              <chakra.span fontWeight={ 500 }>      { argName }</chakra.span>
              <span>{ argTypes?.[argIndex] ? ` (${ argTypes[argIndex] })` : '' } : { String(output.value[argIndex]) }</span>
            </p>
          );
        }) }
      </>
    );
  }

  return (
    <p>
      <span>  </span>
      { name && <chakra.span fontWeight={ 500 }>{ name } </chakra.span> }
      <span>({ output.type }) : { String(output.value) }</span>
    </p>
  );
};

export default React.memo(ContractMethodResultApiItem);
