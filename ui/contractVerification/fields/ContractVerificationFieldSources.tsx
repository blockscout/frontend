import { Text, Button, Box, chakra, Flex } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import DragAndDropArea from 'ui/shared/forms/DragAndDropArea';
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
  const { setValue, getValues, control, formState, clearErrors } = useFormContext<FormFields>();

  const error = 'sources' in formState.errors ? formState.errors.sources : undefined;

  const handleFileRemove = React.useCallback((index?: number) => {
    if (index === undefined) {
      return;
    }

    const value = getValues('sources').slice();
    value.splice(index, 1);
    setValue('sources', value);
    clearErrors('sources');

  }, [ getValues, clearErrors, setValue ]);

  const renderFiles = React.useCallback((files: Array<File>) => {
    return (
      <Box display="grid" gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr' }} columnGap={ 3 } rowGap={ 3 }>
        { files.map((file, index) => (
          <FileSnippet
            key={ file.name + file.lastModified + index }
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
        { ({ onChange }) => (
          <Flex
            flexDir="column"
            alignItems="flex-start"
            rowGap={ 2 }
            w="100%"
            display={ field.value && field.value.length > 0 && !multiple ? 'none' : 'block' }
            mb={ field.value && field.value.length > 0 ? 2 : 0 }
          >
            <Button
              variant="outline"
              size="sm"
              mb={ 2 }
            >
              Upload file{ multiple ? 's' : '' }
            </Button>
            <DragAndDropArea onDrop={ onChange }/>
          </Flex>
        ) }
      </FileInput>
      { field.value && field.value.length > 0 && renderFiles(field.value) }
      { error && (
        <Box fontSize="sm" mt={ 2 } color="error">
          { error.type === 'required' ? 'Field is required' : error.message }
        </Box>
      ) }
    </>
  ), [ accept, error, multiple, renderFiles ]);

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
