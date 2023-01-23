import { Text, Button, Box, chakra } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import FileInput from 'ui/shared/forms/FileInput';
import FileSnippet from 'ui/shared/forms/FileSnippet';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

interface Props {
  accept?: string;
  multiple?: boolean;
  title: string;
  className?: string;
  hint: string;
}

const ContractVerificationFieldSources = ({ accept, multiple, title, className, hint }: Props) => {
  const { setValue, getValues, control, formState } = useFormContext<FormFields>();

  const handleFileRemove = React.useCallback((index?: number) => {
    if (index === undefined) {
      return;
    }

    const value = getValues('sources').slice();
    value.splice(index, 1);
    setValue('sources', value);

  }, [ getValues, setValue ]);

  const renderFiles = React.useCallback((files: Array<File>) => {
    return (
      <Box display="grid" gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr' }} columnGap={ 3 } rowGap={ 3 }>
        { files.map((file, index) => (
          <FileSnippet
            key={ file.name + file.lastModified }
            file={ file }
            maxW="initial"
            onRemove={ handleFileRemove }
            index={ index }
            isDisabled={ formState.isSubmitting }
          />
        )) }
      </Box>
    );
  }, [ formState.isSubmitting, handleFileRemove ]);

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'sources'>}) => (
    <>
      <FileInput<FormFields, 'sources'> accept={ accept } multiple={ multiple } field={ field }>
        <Button variant="outline" size="sm" display={ field.value && field.value.length > 0 ? 'none' : 'block' }>
          Upload file{ multiple ? 's' : '' }
        </Button>
      </FileInput>
      { field.value && field.value.length > 0 && renderFiles(field.value) }
    </>
  ), [ accept, multiple, renderFiles ]);

  return (
    <>
      <ContractVerificationFormRow >
        <Text fontWeight={ 500 } className={ className } mt={ 4 }>{ title }</Text>
      </ContractVerificationFormRow>
      <ContractVerificationFormRow>
        <Controller
          name="sources"
          control={ control }
          render={ renderControl }
          rules={{ required: true }}
        />
        { hint ? <span>{ hint }</span> : null }
      </ContractVerificationFormRow>
    </>
  );
};

export default React.memo(chakra(ContractVerificationFieldSources));
