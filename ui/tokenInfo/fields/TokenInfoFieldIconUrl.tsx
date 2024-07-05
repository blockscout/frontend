import { FormControl, Flex, Input } from '@chakra-ui/react';
import React from 'react';
import type { Control, UseFormTrigger } from 'react-hook-form';
import { useController } from 'react-hook-form';

import type { Fields } from '../types';

import { times } from 'lib/html-entities';
import { validator as validateUrl } from 'lib/validations/url';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

import TokenInfoIconPreview from '../TokenInfoIconPreview';

interface Props {
  control: Control<Fields>;
  isReadOnly?: boolean;
  trigger: UseFormTrigger<Fields>;
}

const TokenInfoFieldIconUrl = ({ control, isReadOnly, trigger }: Props) => {

  const validatePreview = React.useCallback(() => {
    return imageLoadError.current ? 'Unable to load image' : true;
  }, [ ]);

  const { field, formState, fieldState } = useController({
    name: 'icon_url',
    control,
    rules: {
      required: true,
      validate: { url: validateUrl, preview: validatePreview },
    },
  });

  const [ valueForPreview, setValueForPreview ] = React.useState<string>(field.value);
  const imageLoadError = React.useRef(false);

  const handleImageLoadSuccess = React.useCallback(() => {
    imageLoadError.current = false;
    trigger('icon_url');
  }, [ trigger ]);

  const handleImageLoadError = React.useCallback(() => {
    imageLoadError.current = true;
    trigger('icon_url');
  }, [ trigger ]);

  const handleBlur = React.useCallback(() => {
    field.onBlur();
    const isValidUrl = validateUrl(field.value);
    isValidUrl === true && setValueForPreview(field.value);
  }, [ field ]);

  return (
    <Flex columnGap={ 5 }>
      <FormControl variant="floating" id={ field.name } size={{ base: 'md', lg: 'lg' }} isRequired>
        <Input
          { ...field }
          onBlur={ handleBlur }
          isInvalid={ Boolean(fieldState.error) }
          isDisabled={ formState.isSubmitting }
          isReadOnly={ isReadOnly }
          autoComplete="off"
          required
        />
        <InputPlaceholder text={ `Link to icon URL, link to download a SVG or 48${ times }48 PNG icon logo` } error={ fieldState.error }/>
      </FormControl>
      <TokenInfoIconPreview
        url={ fieldState.error?.type === 'url' ? undefined : valueForPreview }
        onLoad={ handleImageLoadSuccess }
        onError={ !isReadOnly ? handleImageLoadError : undefined }
        isInvalid={ fieldState.error?.type === 'preview' }
      />
    </Flex>
  );
};

export default React.memo(TokenInfoFieldIconUrl);
