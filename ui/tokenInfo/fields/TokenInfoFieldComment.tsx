import { FormControl, Textarea } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerProps } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { Fields } from '../types';

import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  control: Control<Fields>;
  isReadOnly?: boolean;
}

const TokenInfoFieldComment = ({ control, isReadOnly }: Props) => {
  const renderControl: ControllerProps<Fields, 'comment'>['render'] = React.useCallback(({ field, fieldState, formState }) => {
    return (
      <FormControl variant="floating" id={ field.name } size={{ base: 'md', lg: 'lg' }}>
        <Textarea
          { ...field }
          isInvalid={ Boolean(fieldState.error) }
          isDisabled={ formState.isSubmitting }
          isReadOnly={ isReadOnly }
          autoComplete="off"
          maxH="160px"
          maxLength={ 300 }
        />
        <InputPlaceholder text="Comment" error={ fieldState.error }/>
      </FormControl>
    );
  }, [ isReadOnly ]);

  return (
    <Controller
      name="comment"
      control={ control }
      render={ renderControl }
      rules={{ maxLength: 300 }}
    />
  );
};

export default React.memo(TokenInfoFieldComment);
