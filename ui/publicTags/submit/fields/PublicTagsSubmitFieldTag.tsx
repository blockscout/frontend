import { chakra, Flex, Grid, GridItem } from '@chakra-ui/react';
import React from 'react';
import { type FieldError, type FieldErrorsImpl, type Merge } from 'react-hook-form';

import type { FormFields, FormFieldTag } from '../types';
import type { PublicTagType } from 'types/api/addressMetadata';

import useIsMobile from 'lib/hooks/useIsMobile';
import { IconButton } from 'toolkit/chakra/icon-button';
import { FormFieldColor } from 'toolkit/components/forms/fields/FormFieldColor';
import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';
import { FormFieldUrl } from 'toolkit/components/forms/fields/FormFieldUrl';
import { colorValidator } from 'toolkit/components/forms/validators/color';
import EntityTag from 'ui/shared/EntityTags/EntityTag';
import IconSvg from 'ui/shared/IconSvg';

import PublicTagsSubmitFieldTagType from './PublicTagsSubmitFieldTagType';

const CIRCLE_BG_COLOR_DEFAULT = {
  bgColor: { _light: 'gray.100', _dark: 'gray.700' },
  textColor: { _light: 'blackAlpha.800', _dark: 'whiteAlpha.800' },
};

interface Props {
  index: number;
  field: FormFieldTag;
  tagTypes: Array<PublicTagType> | undefined;
  errors: Merge<FieldError, FieldErrorsImpl<FormFieldTag>> | undefined;
  isDisabled: boolean;
  onAddClick?: (index: number) => void;
  onRemoveClick?: (index: number) => void;
}

const PublicTagsSubmitFieldTag = ({ index, isDisabled, errors, onAddClick, onRemoveClick, tagTypes, field }: Props) => {
  const isMobile = useIsMobile();
  const bgColorDefault = { _light: 'blackAlpha.50', _dark: 'whiteAlpha.100' };
  const bgColorError = { _light: 'red.50', _dark: 'red.900' };

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
            <FormFieldText<FormFields>
              name={ `tags.${ index }.name` }
              placeholder="Tag (max 35 characters)"
              required
              rules={{ maxLength: 35 }}
            />
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <PublicTagsSubmitFieldTagType index={ index } tagTypes={ tagTypes }/>
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <FormFieldUrl<FormFields>
              name={ `tags.${ index }.url` }
              placeholder="Label URL"
            />
          </GridItem>
          <FormFieldColor<FormFields>
            name={ `tags.${ index }.bgColor` }
            placeholder="Background (Hex)"
            sampleDefaultBgColor={ CIRCLE_BG_COLOR_DEFAULT.bgColor }
          />
          <FormFieldColor<FormFields>
            name={ `tags.${ index }.textColor` }
            placeholder="Text (Hex)"
            sampleDefaultBgColor={ CIRCLE_BG_COLOR_DEFAULT.textColor }
          />
          <GridItem colSpan={{ base: 1, lg: 4 }}>
            <FormFieldText<FormFields>
              name={ `tags.${ index }.tooltipDescription` }
              placeholder="Label description (max 80 characters)"
              maxH="160px"
              rules={{ maxLength: 80 }}
              asComponent="Textarea"
            />
          </GridItem>
        </Grid>
      </GridItem>
      <GridItem py={{ lg: '10px' }}>
        <Flex
          alignItems="center"
          columnGap={ 5 }
          justifyContent={{ base: 'flex-end', lg: 'flex-start' }}
          h={{ base: 'auto', lg: '60px' }}
        >
          { onAddClick && (
            <IconButton
              aria-label="add"
              data-index={ index }
              variant="outline"
              size="md"
              onClick={ handleAddClick }
              disabled={ isDisabled }
            >
              <IconSvg name="plus"/>
            </IconButton>
          ) }
          { onRemoveClick && (
            <IconButton
              aria-label="delete"
              data-index={ index }
              variant="outline"
              size="md"
              onClick={ handleRemoveClick }
              disabled={ isDisabled }
            >
              <IconSvg name="minus"/>
            </IconButton>
          ) }
        </Flex>
        { !isMobile && (
          <Flex flexDir="column" alignItems="flex-start" mt={ 4 } rowGap={ 2 }>
            <EntityTag data={{
              name: field.name || 'Tag name',
              tagType: field.type[0],
              meta: {
                tagUrl: field.url,
                bgColor: field.bgColor && colorValidator(field.bgColor) === true ? field.bgColor : undefined,
                textColor: field.textColor && colorValidator(field.textColor) === true ? field.textColor : undefined,
                tooltipDescription: field.tooltipDescription,
              },
              slug: 'new',
              ordinal: 0,
            }}/>
            <chakra.span color="text.secondary" fontSize="sm">
              { tagTypes?.find(({ type }) => type === field.type[0])?.description }
            </chakra.span>
          </Flex>
        ) }
      </GridItem>
    </>
  );
};

export default PublicTagsSubmitFieldTag;
