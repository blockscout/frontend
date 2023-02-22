import { Text, Button, Box, Flex } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, FieldPathValue, ValidateResult } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import { Mb } from 'lib/consts';
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
  hint: string;
}

const ContractVerificationFieldSources = ({ fileTypes, multiple, title, hint }: Props) => {
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

  const renderUploadButton = React.useCallback(() => {
    return (
      <div>
        <Text fontWeight={ 500 } color="text_secondary" mb={ 3 }>{ title }</Text>
        <Button size="sm" variant="outline">
            Drop file{ multiple ? 's' : '' } or click here
        </Button>
      </div>
    );
  }, [ multiple, title ]);

  const renderFiles = React.useCallback((files: Array<File>) => {
    const errorList = fileError?.message?.split(';');

    return (
      <Box
        display="grid"
        gridTemplateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) minmax(0, 1fr)' }}
        columnGap={ 3 }
        rowGap={ 3 }
        w="100%"
      >
        { files.map((file, index) => (
          <Box key={ file.name + file.lastModified + index }>
            <FileSnippet
              file={ file }
              maxW="initial"
              onRemove={ handleFileRemove }
              index={ index }
              isDisabled={ formState.isSubmitting }
              error={ errorList?.[index] }
            />
          </Box>
        )) }
      </Box>
    );
  }, [ formState.isSubmitting, handleFileRemove, fileError ]);

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'sources'>}) => {
    const hasValue = field.value && field.value.length > 0;
    return (
      <>
        <FileInput<FormFields, 'sources'> accept={ fileTypes.join(',') } multiple={ multiple } field={ field }>
          { ({ onChange }) => (
            <Flex
              flexDir="column"
              alignItems="flex-start"
              rowGap={ 2 }
              w="100%"
            >
              <DragAndDropArea onDrop={ onChange } p={{ base: 3, lg: 6 }} isDisabled={ formState.isSubmitting }>
                { hasValue ? renderFiles(field.value) : renderUploadButton() }
              </DragAndDropArea>
            </Flex>
          ) }
        </FileInput>
        { commonError?.message && <FieldError message={ commonError.type === 'required' ? 'Field is required' : commonError.message }/> }
      </>
    );
  }, [ fileTypes, multiple, commonError, formState.isSubmitting, renderFiles, renderUploadButton ]);

  const validateFileType = React.useCallback(async(value: FieldPathValue<FormFields, 'sources'>): Promise<ValidateResult> => {
    if (Array.isArray(value)) {
      const errorText = `Wrong file type. Allowed files types are ${ fileTypes.join(',') }.`;
      const errors = value.map(({ name }) => fileTypes.some((ext) => name.endsWith(ext)) ? '' : errorText);
      if (errors.some((item) => item !== '')) {
        return errors.join(';');
      }
    }
    return true;
  }, [ fileTypes ]);

  const validateFileSize = React.useCallback(async(value: FieldPathValue<FormFields, 'sources'>): Promise<ValidateResult> => {
    if (Array.isArray(value)) {
      const FILE_SIZE_LIMIT = 20 * Mb;
      const errors = value.map(({ size }) => size > FILE_SIZE_LIMIT ? 'File is too big. Maximum size is 20 Mb.' : '');
      if (errors.some((item) => item !== '')) {
        return errors.join(';');
      }
    }
    return true;
  }, []);

  const validateQuantity = React.useCallback(async(value: FieldPathValue<FormFields, 'sources'>): Promise<ValidateResult> => {
    if (!multiple && Array.isArray(value) && value.length > 1) {
      return 'You can upload only one file';
    }

    return true;
  }, [ multiple ]);

  const rules = React.useMemo(() => ({
    required: true,
    validate: {
      file_type: validateFileType,
      file_size: validateFileSize,
      quantity: validateQuantity,
    },
  }), [ validateFileSize, validateFileType, validateQuantity ]);

  return (
    <ContractVerificationFormRow>
      <Controller
        name="sources"
        control={ control }
        render={ renderControl }
        rules={ rules }
      />
      { hint ? <span>{ hint }</span> : null }
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldSources);
