import { FormControl, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';
import type { PublicTagType } from 'types/api/addressMetadata';

import useIsMobile from 'lib/hooks/useIsMobile';
import FancySelect from 'ui/shared/FancySelect/FancySelect';

interface Props {
  index: number;
  tagTypes: Array<PublicTagType> | undefined;
  isDisabled: boolean;
}

const PublicTagsSubmitFieldTagType = ({ index, tagTypes, isDisabled }: Props) => {
  const isMobile = useIsMobile();
  const { control } = useFormContext<FormFields>();
  const inputBgColor = useColorModeValue('white', 'black');

  const typeOptions = React.useMemo(() => tagTypes?.map((type) => ({
    value: type.type,
    label: type.type,
  })), [ tagTypes ]);

  const renderControl = React.useCallback(({ field }: { field: ControllerRenderProps<FormFields, `tags.${ number }.type`> }) => {
    return (
      <FormControl variant="floating" id={ field.name } isRequired size={{ base: 'md', lg: 'lg' }}>
        <FancySelect
          { ...field }
          options={ typeOptions }
          size={ isMobile ? 'md' : 'lg' }
          placeholder="Tag type"
          isDisabled={ isDisabled }
          isRequired
          isAsync={ false }
          formControlStyles={{
            bgColor: inputBgColor,
            borderRadius: 'base',
          }}
        />
      </FormControl>
    );
  }, [ inputBgColor, isDisabled, isMobile, typeOptions ]);

  return (
    <Controller
      name={ `tags.${ index }.type` }
      control={ control }
      render={ renderControl }
      rules={{ required: true }}
    />
  );
};

export default React.memo(PublicTagsSubmitFieldTagType);
