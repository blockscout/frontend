import { FormControl, GridItem, Link, Textarea } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { FormFields } from '../types';

import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  control: Control<FormFields>;
}

const ContractVerificationFieldAbiEncodedArgs = ({ control }: Props) => {
  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'abi_encoded_args'>}) => {
    return (
      <FormControl variant="floating" id={ field.name } size={{ base: 'md', lg: 'lg' }}>
        <Textarea
          { ...field }
          maxLength={ 255 }
        />
        <InputPlaceholder text="ABI-encoded Constructor Arguments"/>
      </FormControl>
    );
  }, []);

  return (
    <>
      <GridItem>
        <Controller
          name="abi_encoded_args"
          control={ control }
          render={ renderControl }
        />
      </GridItem>
      <GridItem fontSize="sm">
        <span>Add arguments in </span>
        <Link href="https://solidity.readthedocs.io/en/develop/abi-spec.html" target="_blank">ABI hex encoded form</Link>
        <span> if required by the contract. Constructor arguments are written right to left, and will be found at the end of the input created bytecode.</span>
        <span> They may also be </span>
        <Link href="https://abi.hashex.org/" target="_blank">parsed here</Link>
        <span>.</span>
      </GridItem>
    </>
  );
};

export default React.memo(ContractVerificationFieldAbiEncodedArgs);
