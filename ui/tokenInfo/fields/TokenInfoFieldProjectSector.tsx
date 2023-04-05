import React from 'react';
import type { Control, ControllerRenderProps, FormState } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { Fields } from '../types';
import type { TokenInfoApplicationConfig } from 'types/api/account';

import FancySelect from 'ui/shared/FancySelect/FancySelect';

interface Props {
  formState: FormState<Fields>;
  control: Control<Fields>;
  isReadOnly?: boolean;
  config: TokenInfoApplicationConfig['projectSectors'];
}

const TokenInfoFieldProjectSector = ({ formState, control, isReadOnly, config }: Props) => {
  const options = React.useMemo(() => {
    return config.map((option) => ({ label: option, value: option }));
  }, [ config ]);

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<Fields, 'project_sector'>}) => {
    const error = 'project_sector' in formState.errors ? formState.errors.project_sector : undefined;

    return (
      <FancySelect
        { ...field }
        options={ options }
        size="lg"
        placeholder="Project industry"
        isDisabled={ formState.isSubmitting || isReadOnly }
        error={ error }
      />
    );
  }, [ formState.errors, formState.isSubmitting, isReadOnly, options ]);

  return (
    <Controller
      name="project_sector"
      control={ control }
      render={ renderControl }
    />
  );
};

export default React.memo(TokenInfoFieldProjectSector);
