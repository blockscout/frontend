import { chakra, Flex, FormControl, Grid, GridItem, IconButton, Input, Textarea, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { type FieldError, type FieldErrorsImpl, type Merge, type UseFormRegister } from 'react-hook-form';

import type { FormFields, FormFieldTag } from '../types';
import type { PublicTagType } from 'types/api/addressMetadata';

import useIsMobile from 'lib/hooks/useIsMobile';
import { validator as colorValidator } from 'lib/validations/color';
import { validator as urlValidator } from 'lib/validations/url';
import EntityTag from 'ui/shared/EntityTags/EntityTag';
import IconSvg from 'ui/shared/IconSvg';
import InputPlaceholder from 'ui/shared/InputPlaceholder';

import PublicTagsSubmitFieldTagColor from './PublicTagsSubmitFieldTagColor';
import PublicTagsSubmitFieldTagType from './PublicTagsSubmitFieldTagType';

interface Props {
  index: number;
  field: FormFieldTag;
  tagTypes: Array<PublicTagType> | undefined;
  register: UseFormRegister<FormFields>;
  errors: Merge<FieldError, FieldErrorsImpl<FormFieldTag>> | undefined;
  isDisabled: boolean;
  onAddClick?: (index: number) => void;
  onRemoveClick?: (index: number) => void;
}

const PublicTagsSubmitFieldTag = ({ index, isDisabled, register, errors, onAddClick, onRemoveClick, tagTypes, field }: Props) => {
  const isMobile = useIsMobile();
  const bgColorDefault = useColorModeValue('blackAlpha.50', 'whiteAlpha.100');
  const bgColorError = useColorModeValue('red.50', 'red.900');

  const handleAddClick = React.useCallback(() => {
    onAddClick?.(index);
  }, [ index, onAddClick ]);

  const handleRemoveClick = React.useCallback(() => {
    onRemoveClick?.(index);
  }, [ index, onRemoveClick ]);

  return (
    <>
      <GridItem colSpan={{ base: 1, lg: 2 }} p="10px" borderRadius="base" bgColor={ errors ? bgColorError : bgColorDefault }>
        <Grid
          rowGap={ 3 }
          columnGap={ 3 }
          templateColumns={{ base: '1fr', lg: 'repeat(4, 1fr)' }}
        >
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <FormControl variant="floating" isRequired size={{ base: 'md', lg: 'lg' }}>
              <Input
                { ...register(`tags.${ index }.name`, { required: true, maxLength: 35 }) }
                isInvalid={ Boolean(errors?.name) }
                isDisabled={ isDisabled }
                autoComplete="off"
              />
              <InputPlaceholder text="Tag (max 35 characters)" error={ errors?.name }/>
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <PublicTagsSubmitFieldTagType index={ index } tagTypes={ tagTypes } isDisabled={ isDisabled }/>
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <FormControl variant="floating" size={{ base: 'md', lg: 'lg' }}>
              <Input
                { ...register(`tags.${ index }.url`, { validate: urlValidator }) }
                isInvalid={ Boolean(errors?.url) }
                isDisabled={ isDisabled }
                autoComplete="off"
              />
              <InputPlaceholder text="Label URL" error={ errors?.url }/>
            </FormControl>
          </GridItem>
          <PublicTagsSubmitFieldTagColor
            fieldType="bgColor"
            fieldName={ `tags.${ index }.bgColor` }
            placeholder="Background (Hex)"
            index={ index }
            register={ register }
            error={ errors?.bgColor }
            isDisabled={ isDisabled }
          />
          <PublicTagsSubmitFieldTagColor
            fieldType="textColor"
            fieldName={ `tags.${ index }.textColor` }
            placeholder="Text (Hex)"
            index={ index }
            register={ register }
            error={ errors?.textColor }
            isDisabled={ isDisabled }
          />
          <GridItem colSpan={{ base: 1, lg: 4 }}>
            <FormControl variant="floating" size={{ base: 'md', lg: 'lg' }}>
              <Textarea
                { ...register(`tags.${ index }.tooltipDescription`, { maxLength: 80 }) }
                isInvalid={ Boolean(errors?.tooltipDescription) }
                isDisabled={ isDisabled }
                autoComplete="off"
                maxH="160px"
              />
              <InputPlaceholder
                text="Label description (max 80 characters)"
                error={ errors?.tooltipDescription }
              />
            </FormControl>
          </GridItem>
        </Grid>
      </GridItem>
      <GridItem py={{ lg: '10px' }}>
        <Flex
          alignItems="center"
          columnGap={ 5 }
          justifyContent={{ base: 'flex-end', lg: 'flex-start' }}
          h={{ base: 'auto', lg: '80px' }}
        >
          { onAddClick && (
            <IconButton
              aria-label="add"
              data-index={ index }
              variant="outline"
              boxSize="30px"
              onClick={ handleAddClick }
              icon={ <IconSvg name="plus" boxSize={ 5 }/> }
              isDisabled={ isDisabled }
            />
          ) }
          { onRemoveClick && (
            <IconButton
              aria-label="delete"
              data-index={ index }
              variant="outline"
              boxSize="30px"
              onClick={ handleRemoveClick }
              icon={ <IconSvg name="minus" boxSize={ 5 }/> }
              isDisabled={ isDisabled }
            />
          ) }
        </Flex>
        { !isMobile && (
          <Flex flexDir="column" alignItems="flex-start" mt={ 10 } rowGap={ 2 }>
            <EntityTag data={{
              name: field.name || 'Tag name',
              tagType: field.type.value,
              meta: {
                tagUrl: field.url,
                bgColor: field.bgColor && colorValidator(field.bgColor) === true ? field.bgColor : undefined,
                textColor: field.textColor && colorValidator(field.textColor) === true ? field.textColor : undefined,
                tooltipDescription: field.tooltipDescription,
              },
              slug: 'new',
              ordinal: 0,
            }}/>
            <chakra.span color="text_secondary" fontSize="sm">
              { tagTypes?.find(({ type }) => type === field.type.value)?.description }
            </chakra.span>
          </Flex>
        ) }
      </GridItem>
    </>
  );
};

export default PublicTagsSubmitFieldTag;
