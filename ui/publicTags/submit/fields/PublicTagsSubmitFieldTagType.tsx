import { chakra, Flex, FormControl } from '@chakra-ui/react';
import type { GroupBase, SelectComponentsConfig, SingleValueProps } from 'chakra-react-select';
import { chakraComponents } from 'chakra-react-select';
import _capitalize from 'lodash/capitalize';
import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';
import type { PublicTagType } from 'types/api/addressMetadata';
import type { Option } from 'ui/shared/FancySelect/types';

import useIsMobile from 'lib/hooks/useIsMobile';
import FancySelect from 'ui/shared/FancySelect/FancySelect';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  index: number;
  tagTypes: Array<PublicTagType> | undefined;
  isDisabled: boolean;
}

const PublicTagsSubmitFieldTagType = ({ index, tagTypes, isDisabled }: Props) => {
  const isMobile = useIsMobile();
  const { control, watch } = useFormContext<FormFields>();

  const typeOptions = React.useMemo(() => tagTypes?.map((type) => ({
    value: type.type,
    label: _capitalize(type.type),
  })), [ tagTypes ]);

  const fieldValue = watch(`tags.${ index }.type`).value;

  const selectComponents: SelectComponentsConfig<Option, boolean, GroupBase<Option>> = React.useMemo(() => {
    type SingleValueComponentProps = SingleValueProps<Option, boolean, GroupBase<Option>> & { children: React.ReactNode }
    const SingleValue = ({ children, ...props }: SingleValueComponentProps) => {
      switch (fieldValue) {
        case 'name': {
          return (
            <chakraComponents.SingleValue { ...props }>
              <Flex alignItems="center" columnGap={ 1 }>
                <IconSvg name="publictags_slim" boxSize={ 4 } flexShrink={ 0 } color="gray.400"/>
                { children }
              </Flex>
            </chakraComponents.SingleValue>
          );
        }
        case 'protocol':
        case 'generic': {
          return (
            <chakraComponents.SingleValue { ...props }>
              <chakra.span color="gray.400">#</chakra.span> { children }
            </chakraComponents.SingleValue>
          );
        }

        default: {
          return (<chakraComponents.SingleValue { ...props }>{ children }</chakraComponents.SingleValue>);
        }
      }
    };

    return { SingleValue };
  }, [ fieldValue ]);

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
          isSearchable={ false }
          components={ selectComponents }
        />
      </FormControl>
    );
  }, [ isDisabled, isMobile, selectComponents, typeOptions ]);

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
