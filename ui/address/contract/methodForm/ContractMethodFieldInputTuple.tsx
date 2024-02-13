import React from 'react';

import type { SmartContractMethodInput } from 'types/api/contract';

import { ARRAY_REGEXP } from '../utils';
import type { Props as AccordionProps } from './ContractMethodFieldAccordion';
import ContractMethodFieldAccordion from './ContractMethodFieldAccordion';
import ContractMethodFieldInput from './ContractMethodFieldInput';
import ContractMethodFieldInputArray from './ContractMethodFieldInputArray';

interface Props extends Pick<AccordionProps, 'onAddClick' | 'onRemoveClick' | 'index'> {
  data: SmartContractMethodInput;
  basePath: string;
  level: number;
}

const ContractMethodFieldInputTuple = ({ data, basePath, level, ...accordionProps }: Props) => {
  return (
    <ContractMethodFieldAccordion
      { ...accordionProps }
      level={ level }
      label={ `${ data.name || '<arg w/o name>' } (${ data.type }) level: ${ level }` }
    >
      { data.components?.map((component, index) => {
        if (component.components && component.type === 'tuple') {
          return <ContractMethodFieldInputTuple key={ index } data={ component } basePath={ `${ basePath }:${ index }` } level={ level + 1 }/>;
        }

        const arrayMatch = component.type.match(ARRAY_REGEXP);
        if (arrayMatch) {
          return <ContractMethodFieldInputArray key={ index } data={ component } basePath={ `${ basePath }:${ index }` } level={ level + 1 }/>;
        }

        return <ContractMethodFieldInput key={ index } data={ component } path={ `${ basePath }:${ index }` }/>;
      }) }
    </ContractMethodFieldAccordion>
  );
};

export default ContractMethodFieldInputTuple;
