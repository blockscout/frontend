import { Box } from '@chakra-ui/react';
import React from 'react';

import type { File } from './types';

import CodeEditorFileTree from './CodeEditorFileTree';
import composeFileTree from './utils/composeFileTree';

interface Props {
  data: Array<File>;
  onFileSelect: (index: number) => void;
}

const CodeEditorFileExplorer = ({ data, onFileSelect }: Props) => {
  const tree = React.useMemo(() => {
    return composeFileTree(data);
  }, [ data ]);

  const handleFileClick = React.useCallback((event: React.MouseEvent) => {
    const filePath = (event.currentTarget as HTMLDivElement).getAttribute('data-file-path');
    const fileIndex = data.findIndex((item) => item.file_path === filePath);

    if (fileIndex > -1) {
      onFileSelect(fileIndex);
    }
  }, [ data, onFileSelect ]);

  return (
    <Box>
      <CodeEditorFileTree tree={ tree } onItemClick={ handleFileClick }/>
    </Box>
  );
};

export default React.memo(CodeEditorFileExplorer);
