import { Code, Select, Checkbox } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { useFormContext, Controller } from 'react-hook-form';

import type { FormFields } from '../types';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const COMPILERS = [
  'v0.8.17+commit.8df45f5f',
  'v0.8.16+commit.07a7930e',
  'v0.8.15+commit.e14f2714',
];

const COMPILERS_NIGHTLY = [
  'v0.8.18-nightly.2022.11.23+commit.eb2f874e',
  'v0.8.17-nightly.2022.8.24+commit.22a0c46e',
  'v0.8.16-nightly.2022.7.6+commit.b6f11b33',
];

interface Props {
  isVyper?: boolean;
}

const ContractVerificationFieldCompiler = ({ isVyper }: Props) => {
  const [ isNightly, setIsNightly ] = React.useState(false);
  const { formState, control } = useFormContext<FormFields>();

  const handleCheckboxChange = React.useCallback(() => {
    setIsNightly(prev => !prev);
  }, []);

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'compiler'>}) => {
    const error = 'compiler' in formState.errors ? formState.errors.compiler : undefined;

    return (
      <Select
        { ...field }
        size={{ base: 'md', lg: 'lg' }}
        placeholder="Compiler"
        isInvalid={ Boolean(error) }
        isDisabled={ formState.isSubmitting }
      >
        { [ ...COMPILERS, ...(isNightly ? COMPILERS_NIGHTLY : []) ].map((option) => <option key={ option } value={ option }>{ option }</option>) }
      </Select>
    );
  }, [ formState.errors, formState.isSubmitting, isNightly ]);

  return (
    <ContractVerificationFormRow>
      <>
        <Controller
          name="compiler"
          control={ control }
          render={ renderControl }
          rules={{ required: true }}
        />
        { !isVyper && (
          <Checkbox
            size="lg"
            mt={ 3 }
            onChange={ handleCheckboxChange }
            isDisabled={ formState.isSubmitting }
          >
            Include nightly builds
          </Checkbox>
        ) }
      </>
      { isVyper ? null : (
        <>
          <span>The compiler version is specified in </span>
          <Code color="text_secondary">pragma solidity X.X.X</Code>
          <span>. Use the compiler version rather than the nightly build. If using the Solidity compiler, run </span>
          <Code color="text_secondary">solc —version</Code>
          <span> to check.</span>
        </>
      ) }
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldCompiler);
