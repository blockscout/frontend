import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';
import type { PublicTagType } from 'types/api/addressMetadata';

import PublicTagsSubmitFieldTag from './PublicTagsSubmitFieldTag';

const LIMIT = 5;

interface Props {
  tagTypes: Array<PublicTagType> | undefined;
}

const PublicTagsSubmitFieldTags = ({ tagTypes }: Props) => {
  const { control, formState, register } = useFormContext<FormFields>();
  const { fields, insert, remove } = useFieldArray<FormFields, 'tags'>({
    name: 'tags',
    control,
  });

  const isDisabled = formState.isSubmitting;

  const handleAddFieldClick = React.useCallback((index: number) => {
    insert(index + 1, { name: '', type: 'name', url: undefined, bgColor: undefined, textColor: undefined, tooltipDescription: undefined });
  }, [ insert ]);

  const handleRemoveFieldClick = React.useCallback((index: number) => {
    remove(index);
  }, [ remove ]);

  return (
    <>
      { fields.map((field, index) => {
        const errors = formState.errors?.tags?.[ index ];

        return (
          <PublicTagsSubmitFieldTag
            key={ field.id }
            index={ index }
            tagTypes={ tagTypes }
            register={ register }
            errors={ errors }
            isDisabled={ isDisabled }
            onAddClick={ fields.length < LIMIT && !(fields.length > 1 && index === 0) ? handleAddFieldClick : undefined }
            onRemoveClick={ fields.length > 1 ? handleRemoveFieldClick : undefined }
          />
        );
      }) }
    </>
  );
};

export default React.memo(PublicTagsSubmitFieldTags);
