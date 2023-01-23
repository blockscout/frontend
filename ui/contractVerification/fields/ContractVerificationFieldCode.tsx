import { FormControl, Link, Textarea } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { FormFields } from '../types';

import InputPlaceholder from 'ui/shared/InputPlaceholder';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

interface Props {
  control: Control<FormFields>;
  isVyper?: boolean;
}

const ContractVerificationFieldCode = ({ control, isVyper }: Props) => {
  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'code'>}) => {
    return (
      <FormControl variant="floating" id={ field.name } isRequired size={{ base: 'md', lg: 'lg' }}>
        <Textarea
          { ...field }
          required
          maxLength={ 255 }
        />
        <InputPlaceholder text="Contract code"/>
      </FormControl>
    );
  }, []);

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
