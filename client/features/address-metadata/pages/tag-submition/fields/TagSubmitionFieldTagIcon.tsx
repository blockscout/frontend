// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { FormFields } from '../types';

import SpriteIcon from 'client/sprite/SpriteIcon';

import { FormFieldUrl } from 'toolkit/components/forms/fields/FormFieldUrl';
import { FormFieldImagePreview } from 'toolkit/components/forms/fields/image/FormFieldImagePreview';
import { useImageField } from 'toolkit/components/forms/fields/image/useImageField';

import TagSubmitionFieldTagIconPreview from './TagSubmitionFieldTagIconPreview';

interface Props {
  index: number;
}

const TagSubmitionFieldTagIcon = ({ index }: Props) => {

  const imageField = useImageField({ name: `tags.${ index }.iconUrl`, isRequired: false });

  return (
    <Flex columnGap={ 3 }>
      <FormFieldUrl<FormFields>
        name={ `tags.${ index }.iconUrl` }
        placeholder="Label icon URL"
        { ...imageField.input }
      />
      <TagSubmitionFieldTagIconPreview url={ imageField.preview.src } isInvalid={ imageField.preview.isInvalid }>
        <FormFieldImagePreview
          { ...imageField.preview }
          fallback={ <SpriteIcon name="blobs/image" color="icon.primary" boxSize="30px"/> }
          boxSize="30px"
        />
      </TagSubmitionFieldTagIconPreview>
    </Flex>
  );
};

export default React.memo(TagSubmitionFieldTagIcon);
