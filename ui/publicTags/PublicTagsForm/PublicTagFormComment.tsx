import { FormControl, FormLabel, Textarea } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import type { ControllerRenderProps, Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import getPlaceholderWithError from 'lib/getPlaceholderWithError';

import type { Inputs } from './PublicTagsForm';

const TEXT_INPUT_MAX_LENGTH = 255;

interface Props {
  control: Control<Inputs>;
  error?: string;
}

export default function PublicTagFormComment({ control, error }: Props) {
  const renderComment = useCallback(({ field }: {field: ControllerRenderProps<Inputs, 'comment'>}) => {
    return (
      <FormControl variant="floating" id={ field.name } size="lg" isRequired>
        <Textarea
          { ...field }
          isInvalid={ Boolean(error) }
          size="lg"
        />
        <FormLabel>
          { getPlaceholderWithError('Specify the reason for adding tags and color preference(s)', error) }
        </FormLabel>
      </FormControl>
    );
  }, [ error ]);

  return (
    <Controller
      name="comment"
      control={ control }
      render={ renderComment }
      rules={{ maxLength: TEXT_INPUT_MAX_LENGTH }}
    />
  );
}
