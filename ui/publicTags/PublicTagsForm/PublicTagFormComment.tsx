import type { InputProps } from '@chakra-ui/react';
import { FormControl, Textarea } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import type { ControllerRenderProps, Control, FieldError } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import InputPlaceholder from 'ui/shared/InputPlaceholder';

import type { Inputs } from './PublicTagsForm';

const TEXT_INPUT_MAX_LENGTH = 255;

interface Props {
  control: Control<Inputs>;
  error?: FieldError;
  size?: InputProps['size'];
}

export default function PublicTagFormComment({ control, error, size }: Props) {
  const renderComment = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'comment'>}) => {
    return (
      <FormControl variant="floating" id={ field.name } size={ size } isRequired>
        <Textarea
          { ...field }
          isInvalid={ Boolean(error) }
        />
        <InputPlaceholder text="Specify the reason for adding tags and color preference(s)" error={ error }/>
      </FormControl>
    );
  }, [ error, size ]);

  return (
    <Controller
      name="comment"
      control={ control }
      render={ renderComment }
      rules={{
        maxLength: TEXT_INPUT_MAX_LENGTH,
        required: true,
      }}
    />
  );
}
