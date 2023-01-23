import { GridItem, Text, Button, Box } from '@chakra-ui/react';
import React from 'react';
import type { ControllerRenderProps, Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { FormFields } from '../types';

import FileInput from 'ui/shared/forms/FileInput';
import FileSnippet from 'ui/shared/forms/FileSnippet';

interface Props {
  control: Control<FormFields>;
}

const ContractVerificationFieldSources = ({ control }: Props) => {
  const renderFiles = React.useCallback((files: Array<File>) => {
    return (
      <Box display="grid" gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr' }} columnGap={ 3 } rowGap={ 3 }>
        { files.map((file, index) => <FileSnippet key={ file.name + index } file={ file } maxW="initial"/>) }
      </Box>
    );
  }, []);

  const renderControl = React.useCallback(({ field }: {field: ControllerRenderProps<FormFields, 'sources'>}) => (
    <>
      <FileInput<FormFields, 'sources'> accept=".sol,.yul" multiple field={ field }>
        <Button variant="outline" size="sm" display={ field.value && field.value.length > 0 ? 'none' : 'block' }>
          Upload file
        </Button>
      </FileInput>
      { field.value && field.value.length > 0 && renderFiles(field.value) }
    </>
  ), [ renderFiles ]);

  return (
    <>
      <GridItem mt="30px">
        <Text fontWeight={ 500 } mb={ 4 }>Sources *.sol or *.yul files</Text>
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
