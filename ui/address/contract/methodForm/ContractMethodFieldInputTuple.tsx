import React from 'react';
import { useFormContext } from 'react-hook-form';

import type { SmartContractMethodInput } from 'types/api/contract';

import type { Props as AccordionProps } from './ContractMethodFieldAccordion';
import ContractMethodFieldAccordion from './ContractMethodFieldAccordion';
import ContractMethodFieldInput from './ContractMethodFieldInput';
import ContractMethodFieldInputArray from './ContractMethodFieldInputArray';
import { ARRAY_REGEXP, getFieldLabel } from './utils';

interface Props extends Pick<AccordionProps, 'onAddClick' | 'onRemoveClick' | 'index'> {
  data: SmartContractMethodInput;
  basePath: string;
  level: number;
  isDisabled: boolean;
}

const ContractMethodFieldInputTuple = ({ data, basePath, level, isDisabled, ...accordionProps }: Props) => {
  const { formState: { errors } } = useFormContext();
  const fieldsWithErrors = Object.keys(errors);
  const isInvalid = fieldsWithErrors.some((field) => field.startsWith(basePath));

  return (
    <ContractMethodFieldAccordion
      { ...accordionProps }
      level={ level }
      label={ getFieldLabel(data) }
      isInvalid={ isInvalid }
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
          const [ , itemType ] = arrayMatch;
          return (
            <ContractMethodFieldInputArray
              key={ index }
              data={ component }
              basePath={ `${ basePath }:${ index }` }
              level={ itemType === 'tuple' ? level + 1 : level }
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
            level={ level }
          />
        );
      }) }
    </ContractMethodFieldAccordion>
  );
};

export default React.memo(ContractMethodFieldInputTuple);
