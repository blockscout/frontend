import { Box } from '@chakra-ui/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import type { MethodFormFields } from './types';
import type { SmartContractMethodArgType } from 'types/api/contract';

import ContractMethodField from './ContractMethodField';
import ContractMethodFieldArray from './ContractMethodFieldArray';
import { ARRAY_REGEXP } from './utils';

interface Props {
  fieldName: string;
  argName: string;
  argType: SmartContractMethodArgType;
  onChange: () => void;
  isDisabled: boolean;
  isGrouped?: boolean;
}

const ContractMethodCallableRow = ({ argName, fieldName, argType, onChange, isDisabled, isGrouped }: Props) => {
  const { control, getValues, setValue } = useFormContext<MethodFormFields>();
  const arrayTypeMatch = argType.match(ARRAY_REGEXP);

  const content = arrayTypeMatch ? (
    <ContractMethodFieldArray
      name={ fieldName }
      argType={ arrayTypeMatch[1] as SmartContractMethodArgType }
      size={ Number(arrayTypeMatch[2] || Infinity) }
      control={ control }
      setValue={ setValue }
      getValues={ getValues }
      isDisabled={ isDisabled }
      onChange={ onChange }
    />
  ) : (
    <ContractMethodField
      name={ fieldName }
      argType={ argType }
      placeholder={ argType }
      control={ control }
      setValue={ setValue }
      getValues={ getValues }
      isDisabled={ isDisabled }
      onChange={ onChange }
    />
  );

  return (
    <>
      <Box
        fontWeight={ 500 }
        lineHeight="20px"
        py={{ lg: '6px' }}
        fontSize="sm"
        color={ isGrouped ? 'text_secondary' : 'initial' }
        wordBreak="break-word"
      >
        { argName } ({ argType })
      </Box>
      { content }
    </>
  );
};

export default React.memo(ContractMethodCallableRow);
