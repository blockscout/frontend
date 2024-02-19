import React from 'react';

import type { SmartContractMethodInput } from 'types/api/contract';

import type { Props as AccordionProps } from './ContractMethodFieldAccordion';
import ContractMethodFieldAccordion from './ContractMethodFieldAccordion';
import ContractMethodFieldInput from './ContractMethodFieldInput';
import ContractMethodFieldInputArray from './ContractMethodFieldInputArray';
import { ARRAY_REGEXP } from './utils';

interface Props extends Pick<AccordionProps, 'onAddClick' | 'onRemoveClick' | 'index'> {
  data: SmartContractMethodInput;
  basePath: string;
  level: number;
  isDisabled: boolean;
}

const ContractMethodFieldInputTuple = ({ data, basePath, level, isDisabled, ...accordionProps }: Props) => {
  return (
    <ContractMethodFieldAccordion
      { ...accordionProps }
      level={ level }
      label={ `${ data.name || '<arg w/o name>' } (${ data.type }) level: ${ level }` }
    >
      { data.components?.map((component, index) => {
        if (component.components && component.type === 'tuple') {
          return (
            <ContractMethodFieldInputTuple
              key={ index }
              data={ component }
              basePath={ `${ basePath }:${ index }` }
              level={ level + 1 }
              isDisabled={ isDisabled }
            />
          );
        }

        const arrayMatch = component.type.match(ARRAY_REGEXP);
        if (arrayMatch) {
          return (
            <ContractMethodFieldInputArray
              key={ index }
              data={ component }
              basePath={ `${ basePath }:${ index }` }
              level={ level + 1 }
              isDisabled={ isDisabled }
            />
          );
        }

        return (
          <ContractMethodFieldInput
            key={ index }
            data={ component }
            path={ `${ basePath }:${ index }` }
            isDisabled={ isDisabled }
          />
        );
      }) }
    </ContractMethodFieldAccordion>
  );
};

export default React.memo(ContractMethodFieldInputTuple);
