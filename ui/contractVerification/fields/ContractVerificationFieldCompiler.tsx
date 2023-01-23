import { Code, Select, Checkbox } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

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
  control: Control<FormFields>;
  isVyper?: boolean;
}

const ContractVerificationFieldCompiler = ({ control, isVyper }: Props) => {
  const [ isNightly, setIsNightly ] = React.useState(false);

  const handleCheckboxChange = React.useCallback(() => {
    setIsNightly(prev => !prev);
  }, []);

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'compiler'>}) => {
    return (
      <Select
        { ...field }
        size={{ base: 'md', lg: 'lg' }}
        placeholder="Compiler"
      >
        { [ ...COMPILERS, ...(isNightly ? COMPILERS_NIGHTLY : []) ].map((option) => <option key={ option } value={ option }>{ option }</option>) }
      </Select>
    );
  }, [ isNightly ]);

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
          >
            Include nightly builds
          </Checkbox>
        ) }
      </>
      { isVyper ? null : (
        <>
          <span>The compiler version is specified in </span>
          <Code>pragma solidity X.X.X</Code>
          <span>. Use the compiler version rather than the nightly build. If using the Solidity compiler, run </span>
          <Code>solc —version</Code>
          <span> to check.</span>
        </>
      ) }
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldCompiler);
