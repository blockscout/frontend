import { Box } from '@chakra-ui/react';
import React from 'react';

import type { File } from './types';

import CodeEditorFileExplorer from './CodeEditorFileExplorer';

interface Props {
  data: Array<File>;
  onFileSelect: (index: number) => void;
}

const CodeEditorSideBar = ({ onFileSelect, data }: Props) => {
  return (
    <Box w="250px" flexShrink={ 0 } bgColor="lightpink" fontSize="sm" overflowY="scroll">
      <Box fontFamily="heading" pl={ 3 } letterSpacing={ 0.5 } fontWeight={ 600 }>EXPLORER</Box>
      <CodeEditorFileExplorer data={ data } onFileSelect={ onFileSelect }/>
    </Box>
  );
};

export default React.memo(CodeEditorSideBar);
