import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { Fields } from '../types';

import { times } from 'lib/html-entities';
import type { FieldProps } from 'toolkit/chakra/field';
import ImageUrlPreview from 'ui/shared/forms/components/ImageUrlPreview';
import FormFieldUrl from 'ui/shared/forms/fields/FormFieldUrl';
import useFieldWithImagePreview from 'ui/shared/forms/utils/useFieldWithImagePreview';
import TokenLogoPlaceholder from 'ui/shared/TokenLogoPlaceholder';

import TokenInfoIconPreview from '../TokenInfoIconPreview';

interface Props {
  readOnly?: boolean;
  size?: FieldProps['size'];
}

const TokenInfoFieldIconUrl = ({ readOnly, size }: Props) => {

  const previewUtils = useFieldWithImagePreview({ name: 'icon_url', isRequired: true });

  return (
    <Flex columnGap={ 5 }>
      <FormFieldUrl<Fields>
        name="icon_url"
        placeholder={ `Link to icon URL, link to download a SVG or 48${ times }48 PNG icon logo` }
        readOnly={ readOnly }
        size={ size }
        { ...previewUtils.input }
      />
      <TokenInfoIconPreview url={ previewUtils.preview.src } isInvalid={ previewUtils.preview.isInvalid }>
        <ImageUrlPreview
          { ...previewUtils.preview }
          fallback={ <TokenLogoPlaceholder boxSize={ 10 }/> }
          boxSize={ 10 }
          borderRadius="base"
        />
      </TokenInfoIconPreview>
    </Flex>
  );
};

export default React.memo(TokenInfoFieldIconUrl);
