import { FormControl, Input } from '@chakra-ui/react';
import React from 'react';
import type { Control, ControllerProps } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { validator as validateUrl } from 'lib/validations/url';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

import type { Inputs } from '../ContractSubmitAuditForm';

interface Props {
  control: Control<Inputs>;
}

const AuditReportUrl = ({ control }: Props) => {
  const renderControl: ControllerProps<Inputs, 'audit_report_url'>['render'] = React.useCallback(({ field, fieldState }) => {
    return (
      <FormControl variant="floating" id={ field.name } isRequired>
        <Input
          { ...field }
          required
          isInvalid={ Boolean(fieldState.error) }
          autoComplete="off"
        />
        <InputPlaceholder text="Audit report URL" error={ fieldState.error }/>
      </FormControl>
    );
  }, [ ]);

  return (
    <Controller
      name="audit_report_url"
      control={ control }
      render={ renderControl }
      rules={{ required: true, validate: { url: validateUrl } }}
    />
  );
};

export default React.memo(AuditReportUrl);
