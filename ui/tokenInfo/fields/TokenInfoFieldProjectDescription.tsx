import { FormControl, Text, Textarea } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerProps } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { Fields } from '../types';

import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  control: Control<Fields>;
  isReadOnly?: boolean;
}

const TokenInfoFieldProjectDescription = ({ control, isReadOnly }: Props) => {
  const renderControl: ControllerProps<Fields, 'project_description'>['render'] = React.useCallback(({ field, fieldState, formState }) => {
    return (
      <FormControl variant="floating" id={ field.name } size={{ base: 'md', lg: 'lg' }} isRequired>
        <Textarea
          { ...field }
          required
          isInvalid={ Boolean(fieldState.error) }
          isDisabled={ formState.isSubmitting }
          isReadOnly={ isReadOnly }
          autoComplete="off"
          maxH="160px"
          maxLength={ 300 }
        />
        <InputPlaceholder text="Project description" error={ fieldState.error }/>
        <Text variant="secondary" fontSize="sm" mt={ 1 }>
          Introduce or summarize the project’s operation/goals in a maximum of 300 characters.
          The description should be written in a neutral point of view and must exclude unsubstantiated claims unless proven otherwise.
        </Text>
      </FormControl>
    );
  }, [ isReadOnly ]);

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
