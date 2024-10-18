import { FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerProps } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import dayjs from 'lib/date/dayjs';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

import type { Inputs } from '../ContractSubmitAuditForm';

interface Props {
  control: Control<Inputs>;
}

const AuditCompanyName = ({ control }: Props) => {
  const renderControl: ControllerProps<Inputs, 'audit_publish_date'>['render'] = React.useCallback(({ field, fieldState }) => {
    return (
      <FormControl variant="floating" id={ field.name } isRequired>
        <Input
          { ...field }
          required
          isInvalid={ Boolean(fieldState.error) }
          autoComplete="off"
          type="date"
          max={ dayjs().format('YYYY-MM-DD') }
        />
        <InputPlaceholder text="Audit publish date" error={ fieldState.error }/>
      </FormControl>
    );
  }, [ ]);

  return (
    <Controller
      name="audit_publish_date"
      control={ control }
      render={ renderControl }
      rules={{ required: true }}
    />
  );
};

export default React.memo(AuditCompanyName);
