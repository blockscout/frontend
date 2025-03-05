import { createListCollection } from '@chakra-ui/react';
import { capitalize } from 'es-toolkit';
import React from 'react';
// import { useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';
import type { PublicTagType } from 'types/api/addressMetadata';

import FormFieldSelect from 'ui/shared/forms/fields/FormFieldSelect';
// import IconSvg from 'ui/shared/IconSvg';

interface Props {
  index: number;
  tagTypes: Array<PublicTagType> | undefined;
}

const PublicTagsSubmitFieldTagType = ({ index, tagTypes }: Props) => {
  // const { watch } = useFormContext<FormFields>();

  const collection = React.useMemo(() => {
    const items = tagTypes?.map((type) => ({
      value: type.type,
      label: capitalize(type.type),
    })) ?? [];

    return createListCollection({ items });
  }, [ tagTypes ]);

  // const fieldValue = watch(`tags.${ index }.type`).value;

  // TODO @tom2drum: add icon for selected value
  // const selectComponents: SelectComponentsConfig<Option, boolean, GroupBase<Option>> = React.useMemo(() => {
  //   type SingleValueComponentProps = SingleValueProps<Option, boolean, GroupBase<Option>> & { children: React.ReactNode };
  //   const SingleValue = ({ children, ...props }: SingleValueComponentProps) => {
  //     switch (fieldValue) {
  //       case 'name': {
  //         return (
  //           <chakraComponents.SingleValue { ...props }>
  //             <Flex alignItems="center" columnGap={ 1 }>
  //               <IconSvg name="publictags_slim" boxSize={ 4 } flexShrink={ 0 } color="gray.400"/>
  //               { children }
  //             </Flex>
  //           </chakraComponents.SingleValue>
  //         );
  //       }
  //       case 'protocol':
  //       case 'generic': {
  //         return (
  //           <chakraComponents.SingleValue { ...props }>
  //             <chakra.span color="gray.400">#</chakra.span> { children }
  //           </chakraComponents.SingleValue>
  //         );
  //       }

  //       default: {
  //         return (<chakraComponents.SingleValue { ...props }>{ children }</chakraComponents.SingleValue>);
  //       }
  //     }
  //   };

  //   return { SingleValue };
  // }, [ fieldValue ]);

  return (
    <FormFieldSelect<FormFields, `tags.${ number }.type`>
      name={ `tags.${ index }.type` }
      placeholder="Tag type"
      collection={ collection }
      required
    />
  );
};

export default React.memo(PublicTagsSubmitFieldTagType);
