import React from 'react';
import type { Control, ControllerProps } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { Fields } from '../types';
import type { TokenInfoApplicationConfig } from 'types/api/account';

import useIsMobile from 'lib/hooks/useIsMobile';
import FancySelect from 'ui/shared/FancySelect/FancySelect';

interface Props {
  control: Control<Fields>;
  isReadOnly?: boolean;
  config: TokenInfoApplicationConfig['projectSectors'];
}

const TokenInfoFieldProjectSector = ({ control, isReadOnly, config }: Props) => {
  const isMobile = useIsMobile();

  const options = React.useMemo(() => {
    return config.map((option) => ({ label: option, value: option }));
  }, [ config ]);

  const renderControl: ControllerProps<Fields, 'project_sector'>['render'] = React.useCallback(({ field, fieldState, formState }) => {

    return (
      <FancySelect
        { ...field }
        options={ options }
        size={ isMobile ? 'md' : 'lg' }
        placeholder="Project industry"
        isDisabled={ formState.isSubmitting || isReadOnly }
        error={ fieldState.error }
      />
    );
  }, [ isReadOnly, options, isMobile ]);

  return (
    <Controller
      name="project_sector"
      control={ control }
      render={ renderControl }
    />
  );
};

export default React.memo(TokenInfoFieldProjectSector);
