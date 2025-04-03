import React from 'react';

import type { FormFields } from '../types';

import { Link } from 'toolkit/chakra/link';
import FormFieldText from 'ui/shared/forms/fields/FormFieldText';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const ContractVerificationFieldConstructorArgs = () => {
  return (
    <ContractVerificationFormRow>
      <FormFieldText<FormFields>
        name="constructor_args"
        required
        rules={{ maxLength: 255 }}
        placeholder="ABI-encoded Constructor Arguments"
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
