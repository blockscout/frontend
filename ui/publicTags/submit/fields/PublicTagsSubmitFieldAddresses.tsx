import { GridItem } from '@chakra-ui/react';
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import { IconButton } from 'toolkit/chakra/icon-button';
import { FormFieldAddress } from 'toolkit/components/forms/fields/FormFieldAddress';
import IconSvg from 'ui/shared/IconSvg';

const LIMIT = 20;

const PublicTagsSubmitFieldAddresses = () => {
  const { control, formState } = useFormContext<FormFields>();
  const { fields, insert, remove } = useFieldArray<FormFields, 'addresses'>({
    name: 'addresses',
    control,
  });

  const isDisabled = formState.isSubmitting;

  const handleAddFieldClick = React.useCallback((event: React.MouseEvent) => {
    const index = Number(event.currentTarget.getAttribute('data-index'));
    if (!Object.is(index, NaN)) {
      insert(index + 1, { hash: '' });
    }
  }, [ insert ]);

  const handleRemoveFieldClick = React.useCallback((event: React.MouseEvent) => {
    const index = Number(event.currentTarget.getAttribute('data-index'));
    if (!Object.is(index, NaN)) {
      remove(index);
    }
  }, [ remove ]);

  return (
    <>
      { fields.map((field, index) => {
        return (
          <React.Fragment key={ field.id }>
            <GridItem colSpan={{ base: 1, lg: 2 }}>
              <FormFieldAddress<FormFields>
                name={ `addresses.${ index }.hash` }
                required
                placeholder="Smart contract / Address (0x...)"
              />
            </GridItem>
            <GridItem display="flex" alignItems="center" columnGap={ 5 } justifyContent={{ base: 'flex-end', lg: 'flex-start' }}>
              { fields.length < LIMIT && index === fields.length - 1 && (
                <IconButton
                  aria-label="add"
                  data-index={ index }
                  variant="outline"
                  size="md"
                  onClick={ handleAddFieldClick }
                  disabled={ isDisabled }
                >
                  <IconSvg name="plus"/>
                </IconButton>
              ) }
              { fields.length > 1 && (
                <IconButton
                  aria-label="delete"
                  data-index={ index }
                  variant="outline"
                  size="md"
                  onClick={ handleRemoveFieldClick }
                  disabled={ isDisabled }
                >
                  <IconSvg name="minus"/>
                </IconButton>
              ) }
            </GridItem>
          </React.Fragment>
        );
      }) }
    </>
  );
};

export default React.memo(PublicTagsSubmitFieldAddresses);
