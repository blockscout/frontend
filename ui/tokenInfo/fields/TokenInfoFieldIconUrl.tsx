import { FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerRenderProps, FormState } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { Fields } from '../types';

import { times } from 'lib/html-entities';
import { validator } from 'lib/validations/url';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  formState: FormState<Fields>;
  control: Control<Fields>;
  isReadOnly?: boolean;
}

const TokenInfoFieldIconUrl = ({ formState, control, isReadOnly }: Props) => {
  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<Fields, 'icon_url'>}) => {
    const error = 'icon_url' in formState.errors ? formState.errors.icon_url : undefined;

    return (
      <FormControl variant="floating" id={ field.name } size="lg" isRequired>
        <Input
          { ...field }
          isInvalid={ Boolean(error) }
          isDisabled={ formState.isSubmitting || isReadOnly }
          autoComplete="off"
          required
        />
        <InputPlaceholder text={ `Link to icon URL, link to download a SVG or 48${ times }48 PNG icon logo` } error={ error }/>
      </FormControl>
    );
  }, [ formState.errors, formState.isSubmitting, isReadOnly ]);

  return (
    <Controller
      name="icon_url"
      control={ control }
      render={ renderControl }
      rules={{ required: true, validate: validator }}
    />
  );
};

export default React.memo(TokenInfoFieldIconUrl);
