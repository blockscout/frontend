import { chakra, Flex } from '@chakra-ui/react';
import type { GroupBase, SelectComponentsConfig, SingleValueProps } from 'chakra-react-select';
import { chakraComponents } from 'chakra-react-select';
import _capitalize from 'lodash/capitalize';
import React from 'react';
import { useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';
import type { PublicTagType } from 'types/api/addressMetadata';
import type { Option } from 'ui/shared/forms/inputs/select/types';

import FormFieldFancySelect from 'ui/shared/forms/fields/FormFieldFancySelect';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  index: number;
  tagTypes: Array<PublicTagType> | undefined;
}

const PublicTagsSubmitFieldTagType = ({ index, tagTypes }: Props) => {
  const { watch } = useFormContext<FormFields>();

  const typeOptions = React.useMemo(() => tagTypes?.map((type) => ({
    value: type.type,
    label: _capitalize(type.type),
  })) ?? [], [ tagTypes ]);

  const fieldValue = watch(`tags.${ index }.type`).value;

  const selectComponents: SelectComponentsConfig<Option, boolean, GroupBase<Option>> = React.useMemo(() => {
    type SingleValueComponentProps = SingleValueProps<Option, boolean, GroupBase<Option>> & { children: React.ReactNode };
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

  return (
    <FormFieldFancySelect<FormFields, `tags.${ number }.type`>
      name={ `tags.${ index }.type` }
      placeholder="Tag type"
      options={ typeOptions }
      isRequired
      isAsync={ false }
      isSearchable={ false }
      components={ selectComponents }
    />
  );
};

export default React.memo(PublicTagsSubmitFieldTagType);
