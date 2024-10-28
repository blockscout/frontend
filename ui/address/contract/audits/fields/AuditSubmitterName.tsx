import { FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerProps } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import InputPlaceholder from 'ui/shared/InputPlaceholder';

import type { Inputs } from '../ContractSubmitAuditForm';

interface Props {
  control: Control<Inputs>;
}

const AuditSubmitterName = ({ control }: Props) => {
  const renderControl: ControllerProps<Inputs, 'submitter_name'>['render'] = React.useCallback(({ field, fieldState }) => {
    return (
      <FormControl variant="floating" id={ field.name } isRequired>
        <Input
          { ...field }
          required
          isInvalid={ Boolean(fieldState.error) }
        />
        <InputPlaceholder text="Submitter name" error={ fieldState.error }/>
      </FormControl>
    );
  }, [ ]);

  return (
    <Controller
      name="submitter_name"
      control={ control }
      render={ renderControl }
      rules={{ required: true }}
    />
  );
};

export default React.memo(AuditSubmitterName);
