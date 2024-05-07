import { FormControl, GridItem, IconButton, Input } from '@chakra-ui/react';
import React from 'react';
import type { ControllerFieldState, ControllerRenderProps, UseFormStateReturn } from 'react-hook-form';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import { ADDRESS_REGEXP } from 'lib/validations/address';
import IconSvg from 'ui/shared/IconSvg';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

const LIMIT = 10;

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

  const renderControl = React.useCallback(({ field, formState, fieldState }: {
    field: ControllerRenderProps<FormFields, `addresses.${ number }.hash`>;
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<FormFields>;
  }) => {
    return (
      <FormControl variant="floating" id={ field.name } isRequired size={{ base: 'md', lg: 'lg' }}>
        <Input
          { ...field }
          isInvalid={ Boolean(fieldState.error) }
          isDisabled={ formState.isSubmitting }
          required
          autoComplete="off"
        />
        <InputPlaceholder text="Smart contract / Address (0x...)" error={ fieldState.error }/>
      </FormControl>
    );
  }, []);

  return (
    <>
      { fields.map((field, index) => {
        return (
          <React.Fragment key={ field.id }>
            <GridItem colSpan={{ base: 1, lg: 2 }}>
              <Controller
                name={ `addresses.${ index }.hash` }
                control={ control }
                render={ renderControl }
                rules={{ required: true, pattern: ADDRESS_REGEXP }}
              />
            </GridItem>
            <GridItem display="flex" alignItems="center" columnGap={ 5 }>
              { fields.length < LIMIT && !(fields.length > 1 && index === 0) && (
                <IconButton
                  aria-label="add"
                  data-index={ index }
                  variant="outline"
                  w="30px"
                  h="30px"
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
                  w="30px"
                  h="30px"
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
