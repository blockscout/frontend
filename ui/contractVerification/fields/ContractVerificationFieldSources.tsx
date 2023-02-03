import { Text, Button, Box, chakra, Flex } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, FieldPathValue, ValidateResult } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import DragAndDropArea from 'ui/shared/forms/DragAndDropArea';
import FieldError from 'ui/shared/forms/FieldError';
import FileInput from 'ui/shared/forms/FileInput';
import FileSnippet from 'ui/shared/forms/FileSnippet';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

type FileTypes = '.sol' | '.yul' | '.json' | '.vy'

interface Props {
  fileTypes: Array<FileTypes>;
  multiple?: boolean;
  title: string;
  className?: string;
  hint: string;
}

const ContractVerificationFieldSources = ({ fileTypes, multiple, title, className, hint }: Props) => {
  const { setValue, getValues, control, formState, clearErrors } = useFormContext<FormFields>();

  const error = 'sources' in formState.errors ? formState.errors.sources : undefined;
  const commonError = !error?.type?.startsWith('file_') ? error : undefined;
  const fileError = error?.type?.startsWith('file_') ? error : undefined;

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
    const errorList = fileError?.message?.split(';');

    return (
      <Box display="grid" gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr' }} columnGap={ 3 } rowGap={ 3 }>
        { files.map((file, index) => (
          <Box key={ file.name + file.lastModified + index }>
            <FileSnippet
              file={ file }
              maxW="initial"
              onRemove={ handleFileRemove }
              index={ index }
              isDisabled={ formState.isSubmitting }
            />
            { errorList?.[index] && <FieldError message={ errorList?.[index] } mt={ 1 } px={ 3 }/> }
          </Box>
        )) }
      </Box>
    );
  }, [ formState.isSubmitting, handleFileRemove, fileError ]);

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'sources'>}) => (
    <>
      <FileInput<FormFields, 'sources'> accept={ fileTypes.join(',') } multiple={ multiple } field={ field }>
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
      { commonError?.message && <FieldError message={ commonError.type === 'required' ? 'Field is required' : commonError.message }/> }
    </>
  ), [ fileTypes, commonError, multiple, renderFiles ]);

  const validateFileType = React.useCallback(async(value: FieldPathValue<FormFields, 'sources'>): Promise<ValidateResult> => {
    if (Array.isArray(value)) {
      const errors = value.map(({ name }) => fileTypes.some((ext) => name.endsWith(ext)) ? '' : 'Wrong file type');
      if (errors.some((item) => item !== '')) {
        return errors.join(';');
      }
    }
    return true;
  }, [ fileTypes ]);

  const validateFileSize = React.useCallback(async(value: FieldPathValue<FormFields, 'sources'>): Promise<ValidateResult> => {
    if (Array.isArray(value)) {
      const FILE_SIZE_LIMIT = 260;
      const errors = value.map(({ size }) => size > FILE_SIZE_LIMIT ? 'File is too big' : '');
      if (errors.some((item) => item !== '')) {
        return errors.join(';');
      }
    }
    return true;
  }, []);

  const rules = React.useMemo(() => ({
    required: true,
    validate: {
      file_type: validateFileType,
      file_size: validateFileSize,
    },
  }), [ validateFileSize, validateFileType ]);

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
          rules={ rules }
        />
        { hint ? <span>{ hint }</span> : null }
      </ContractVerificationFormRow>
    </>
  );
};

export default React.memo(chakra(ContractVerificationFieldSources));
