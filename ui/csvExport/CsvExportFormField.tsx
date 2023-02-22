import { FormControl, Input } from '@chakra-ui/react';
import _capitalize from 'lodash/capitalize';
import React from 'react';
import type { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { FormFields } from './types';

import dayjs from 'lib/date/dayjs';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

interface Props {
  formApi: UseFormReturn<FormFields>;
  name: 'from' | 'to';
}

const CsvExportFormField = ({ formApi, name }: Props) => {
  const { formState, control, getValues, trigger } = formApi;

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'from' | 'to'>}) => {
    const error = field.name in formState.errors ? formState.errors[field.name] : undefined;

    return (
      <FormControl variant="floating" id={ field.name } isRequired size={{ base: 'md', lg: 'lg' }} maxW={{ base: 'auto', lg: '220px' }}>
        <Input
          { ...field }
          required
          isInvalid={ Boolean(error) }
          type="date"
          isDisabled={ formState.isSubmitting }
          autoComplete="off"
          max={ dayjs().format('YYYY-MM-DD') }
        />
        <InputPlaceholder text={ _capitalize(field.name) } error={ error }/>
      </FormControl>
    );
  }, [ formState.errors, formState.isSubmitting ]);

  const validate = React.useCallback((newValue: string) => {
    if (name === 'from') {
      const toValue = getValues('to');
      if (toValue && dayjs(newValue) > dayjs(toValue)) {
        return 'Incorrect date';
      }
      if (formState.errors.to) {
        trigger('to');
      }
    } else {
      const fromValue = getValues('from');
      if (fromValue && dayjs(fromValue) > dayjs(newValue)) {
        return 'Incorrect date';
      }
      if (formState.errors.from) {
        trigger('from');
      }
    }
  }, [ formState.errors.from, formState.errors.to, getValues, name, trigger ]);

  return (
    <Controller
      name={ name }
      control={ control }
      render={ renderControl }
      rules={{ required: true, validate }}
    />
  );
};

export default React.memo(CsvExportFormField);
