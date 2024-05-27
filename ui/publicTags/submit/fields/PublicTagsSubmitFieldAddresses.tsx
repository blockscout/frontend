import { FormControl, GridItem, IconButton, Input } from '@chakra-ui/react';
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import { ADDRESS_REGEXP } from 'lib/validations/address';
import IconSvg from 'ui/shared/IconSvg';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

const LIMIT = 20;

const PublicTagsSubmitFieldAddresses = () => {
  const { control, formState, register } = useFormContext<FormFields>();
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
        const error = formState.errors?.addresses?.[ index ]?.hash;

        return (
          <React.Fragment key={ field.id }>
            <GridItem colSpan={{ base: 1, lg: 2 }}>
              <FormControl variant="floating" isRequired size={{ base: 'md', lg: 'lg' }}>
                <Input
                  { ...register(`addresses.${ index }.hash`, { required: true, pattern: ADDRESS_REGEXP }) }
                  isInvalid={ Boolean(error) }
                  isDisabled={ formState.isSubmitting }
                  autoComplete="off"
                />
                <InputPlaceholder text="Smart contract / Address (0x...)" error={ error }/>
              </FormControl>
            </GridItem>
            <GridItem display="flex" alignItems="center" columnGap={ 5 } justifyContent={{ base: 'flex-end', lg: 'flex-start' }}>
              { fields.length < LIMIT && index === fields.length - 1 && (
                <IconButton
                  aria-label="add"
                  data-index={ index }
                  variant="outline"
                  boxSize="30px"
                  onClick={ handleAddFieldClick }
                  icon={ <IconSvg name="plus" boxSize={ 5 }/> }
                  isDisabled={ isDisabled }
                />
              ) }
              { fields.length > 1 && (
                <IconButton
                  aria-label="delete"
                  data-index={ index }
                  variant="outline"
                  boxSize="30px"
                  onClick={ handleRemoveFieldClick }
                  icon={ <IconSvg name="minus" boxSize={ 5 }/> }
                  isDisabled={ isDisabled }
                />
              ) }
            </GridItem>
          </React.Fragment>
        );
      }) }
    </>
  );
};

export default React.memo(PublicTagsSubmitFieldAddresses);
