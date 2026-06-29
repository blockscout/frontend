// SPDX-License-Identifier: LicenseRef-Blockscout

import { createListCollection } from '@chakra-ui/react';
import React from 'react';

import type { Fields } from '../types';
import type * as adminRs from '@blockscout/admin-rs-types';

import { FormFieldSelect } from 'src/toolkit/components/forms/fields/FormFieldSelect';

interface Props {
  readOnly?: boolean;
  config: adminRs.ListTokenInfoSubmissionSelectorsResponse['projectSectors'];
}

const TokenInfoFieldProjectSector = ({ readOnly, config }: Props) => {

  const collection = React.useMemo(() => {
    const items = config.map((option) => ({ label: option, value: option }));
    return createListCollection({ items });
  }, [ config ]);

  return (
    <FormFieldSelect<Fields, 'project_sector'>
      name="project_sector"
      placeholder="Project industry"
      collection={ collection }
      readOnly={ readOnly }
    />
  );
};

export default React.memo(TokenInfoFieldProjectSector);
