import { FormControl, Link, Textarea } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { useFormContext, Controller } from 'react-hook-form';

import type { FormFields } from '../types';

import FieldError from 'ui/shared/forms/FieldError';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

interface Props {
  isVyper?: boolean;
}

const ContractVerificationFieldCode = ({ isVyper }: Props) => {
  const { formState, control } = useFormContext<FormFields>();

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'code'>}) => {
    const error = 'code' in formState.errors ? formState.errors.code : undefined;

    return (
      <FormControl variant="floating" id={ field.name } isRequired size={{ base: 'md', lg: 'lg' }}>
        <Textarea
          { ...field }
          isInvalid={ Boolean(error) }
          isDisabled={ formState.isSubmitting }
          required
        />
        <InputPlaceholder text="Contract code"/>
        { error?.message && <FieldError message={ error?.message }/> }
      </FormControl>
    );
  }, [ formState.errors, formState.isSubmitting ]);

  return (
    <ContractVerificationFormRow>
      <Controller
        name="code"
        control={ control }
        render={ renderControl }
        rules={{ required: true }}
      />
      { isVyper ? null : (
        <>
          <span>We recommend using flattened code. This is necessary if your code utilizes a library or inherits dependencies. Use the </span>
          <Link href="https://github.com/poanetwork/solidity-flattener" target="_blank">POA solidity flattener</Link>
          <span> or the </span>
          <Link href="https://www.npmjs.com/package/truffle-flattener" target="_blank">Truffle flattener</Link>
        </>
      ) }
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldCode);
