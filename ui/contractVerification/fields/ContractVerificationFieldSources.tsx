import { GridItem, Text, Button, Box } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, Control } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import FileInput from 'ui/shared/forms/FileInput';
import FileSnippet from 'ui/shared/forms/FileSnippet';

interface Props {
  control: Control<FormFields>;
  accept?: string;
  multiple?: boolean;
  title: string;
}

const ContractVerificationFieldSources = ({ control, accept, multiple, title }: Props) => {
  const { setValue, getValues } = useFormContext();

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
          />
        )) }
      </Box>
    );
  }, [ handleFileRemove ]);

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
      <GridItem mt="30px">
        <Text fontWeight={ 500 } mb={ 4 }>{ title }</Text>
        <Controller
          name="sources"
          control={ control }
          render={ renderControl }
        />
      </GridItem>
      <GridItem/>
    </>
  );
};

export default React.memo(ContractVerificationFieldSources);
