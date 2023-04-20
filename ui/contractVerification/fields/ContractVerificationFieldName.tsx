import { chakra, Code, FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import InputPlaceholder from 'ui/shared/InputPlaceholder';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

interface Props {
  hint?: string;
  isReadOnly?: boolean;
}

const ContractVerificationFieldName = ({ hint, isReadOnly }: Props) => {
  const { formState, control } = useFormContext<FormFields>();

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'name'>}) => {
    const error = 'name' in formState.errors ? formState.errors.name : undefined;

    return (
      <FormControl variant="floating" id={ field.name } isRequired size={{ base: 'md', lg: 'lg' }}>
        <Input
          { ...field }
          required
          isInvalid={ Boolean(error) }
          maxLength={ 255 }
          isDisabled={ formState.isSubmitting || isReadOnly }
          autoComplete="off"
        />
        <InputPlaceholder text="Contract name" error={ error }/>
      </FormControl>
    );
  }, [ formState.errors, formState.isSubmitting, isReadOnly ]);

  return (
    <ContractVerificationFormRow>
      <Controller
        name="name"
        control={ control }
        render={ renderControl }
        rules={{ required: true }}
      />
      { hint ? <span>{ hint }</span> : (
        <>
          <span>Must match the name specified in the code. For example, in </span>
          <Code color="text_secondary">{ `contract MyContract {..}` }</Code>
          <span>. <chakra.span fontWeight={ 600 }>MyContract</chakra.span> is the contract name.</span>
        </>
      ) }
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldName);
