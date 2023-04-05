import { FormControl, Text, Textarea } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerRenderProps, FormState } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { Fields } from '../types';

import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  formState: FormState<Fields>;
  control: Control<Fields>;
  isReadOnly?: boolean;
}

const TokenInfoFieldProjectDescription = ({ formState, control, isReadOnly }: Props) => {
  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<Fields, 'project_description'>}) => {
    const error = 'project_description' in formState.errors ? formState.errors.project_description : undefined;

    return (
      <FormControl variant="floating" id={ field.name } size="lg" isRequired>
        <Textarea
          { ...field }
          required
          isInvalid={ Boolean(error) }
          isDisabled={ formState.isSubmitting || isReadOnly }
          autoComplete="off"
          maxH="160px"
          maxLength={ 300 }
        />
        <InputPlaceholder text="Project description" error={ error }/>
        <Text variant="secondary" fontSize="sm" mt={ 1 }>
          Introduce or summarise the project’s operation/goals in a maximum of 300 characters.
          The description should be written in a neutral point of view and must exclude unsubstantiated claims unless proven otherwise.
        </Text>
      </FormControl>
    );
  }, [ formState.errors, formState.isSubmitting, isReadOnly ]);

  return (
    <Controller
      name="project_description"
      control={ control }
      render={ renderControl }
      rules={{ required: true, maxLength: 300 }}
    />
  );
};

export default React.memo(TokenInfoFieldProjectDescription);
