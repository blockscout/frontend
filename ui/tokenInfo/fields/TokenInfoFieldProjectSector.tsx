import React from 'react';

import type { Fields } from '../types';
import type { TokenInfoApplicationConfig } from 'types/api/account';

import FormFieldFancySelect from 'ui/shared/forms/fields/FormFieldFancySelect';

interface Props {
  isReadOnly?: boolean;
  config: TokenInfoApplicationConfig['projectSectors'];
}

const TokenInfoFieldProjectSector = ({ isReadOnly, config }: Props) => {

  const options = React.useMemo(() => {
    return config.map((option) => ({ label: option, value: option }));
  }, [ config ]);

  return (
    <FormFieldFancySelect<Fields, 'project_sector'>
      name="project_sector"
      placeholder="Project industry"
      options={ options }
      isReadOnly={ isReadOnly }
    />
  );
};

export default React.memo(TokenInfoFieldProjectSector);
