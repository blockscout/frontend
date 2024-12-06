import { Link } from '@chakra-ui/react';
import React from 'react';

import type { FormFields } from '../types';

import FormFieldText from 'ui/shared/forms/fields/FormFieldText';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const ContractVerificationFieldConstructorArgs = () => {
  return (
    <ContractVerificationFormRow>
      <FormFieldText<FormFields>
        name="constructor_args"
        isRequired
        rules={{ maxLength: 255 }}
        placeholder="ABI-encoded Constructor Arguments"
        size={{ base: 'md', lg: 'lg' }}
        asComponent="Textarea"
      />
      <>
        <span>Add arguments in </span>
        <Link href="https://solidity.readthedocs.io/en/develop/abi-spec.html" target="_blank">ABI hex encoded form</Link>
        <span> if required by the contract. Constructor arguments are written right to left, and will be found at the end of the input created bytecode.</span>
        <span> They may also be </span>
        <Link href="https://abi.hashex.org/" target="_blank">parsed here</Link>
        <span>.</span>
      </>
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldConstructorArgs);
