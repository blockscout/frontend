import { FormControl } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerProps } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import CheckboxInput from 'ui/shared/CheckboxInput';

import type { Inputs } from '../ContractSubmitAuditForm';

interface Props {
  control: Control<Inputs>;
}

const AuditSubmitterIsOwner = ({ control }: Props) => {
  const renderControl: ControllerProps<Inputs, 'is_project_owner'>['render'] = React.useCallback(({ field }) => {
    return (
      <FormControl id={ field.name }>
        <CheckboxInput<Inputs, 'is_project_owner'>
          text="I'm the contract owner"
          field={ field }
        />
      </FormControl>
    );
  }, [ ]);

  return (
    <Controller
      name="is_project_owner"
      control={ control }
      render={ renderControl }
    />
  );
};

export default React.memo(AuditSubmitterIsOwner);
