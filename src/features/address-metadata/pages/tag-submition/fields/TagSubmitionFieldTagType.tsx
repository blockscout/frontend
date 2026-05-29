// SPDX-License-Identifier: LicenseRef-Blockscout

import { createListCollection } from '@chakra-ui/react';
import { capitalize } from 'es-toolkit';
import React from 'react';

import type { FormFields } from '../types';
import type { PublicTagType } from 'src/features/address-metadata/types/api';

import type { SelectOption } from 'src/toolkit/chakra/select';
import { FormFieldSelect } from 'src/toolkit/components/forms/fields/FormFieldSelect';
interface Props {
  index: number;
  tagTypes: Array<PublicTagType> | undefined;
}

const TagSubmitionFieldTagType = ({ index, tagTypes }: Props) => {

  const collection = React.useMemo(() => {
    const items = tagTypes?.map((type) => ({
      value: type.type,
      label: capitalize(type.type),
    })) ?? [];

    return createListCollection<SelectOption>({ items });
  }, [ tagTypes ]);

  return (
    <FormFieldSelect<FormFields, `tags.${ number }.type`>
      name={ `tags.${ index }.type` }
      placeholder="Tag type"
      collection={ collection }
      required
    />
  );
};

export default React.memo(TagSubmitionFieldTagType);
