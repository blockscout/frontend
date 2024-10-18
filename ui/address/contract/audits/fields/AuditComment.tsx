import { FormControl, Textarea } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerProps } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import InputPlaceholder from 'ui/shared/InputPlaceholder';

import type { Inputs } from '../ContractSubmitAuditForm';

interface Props {
  control: Control<Inputs>;
}

const AuditComment = ({ control }: Props) => {
  const renderControl: ControllerProps<Inputs, 'comment'>['render'] = React.useCallback(({ field, fieldState }) => {
    return (
      <FormControl variant="floating" id={ field.name }>
        <Textarea
          { ...field }
          isInvalid={ Boolean(fieldState.error) }
          autoComplete="off"
          maxH="160px"
          maxLength={ 300 }
        />
        <InputPlaceholder text="Comment" error={ fieldState.error }/>
      </FormControl>
    );
  }, [ ]);

  return (
    <Controller
      name="comment"
      control={ control }
      render={ renderControl }
      rules={{ maxLength: 300 }}
    />
  );
};

export default React.memo(AuditComment);
