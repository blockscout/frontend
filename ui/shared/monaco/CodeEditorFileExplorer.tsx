import { Box } from '@chakra-ui/react';
import React from 'react';

import type { File } from './types';

import CodeEditorFileTree from './CodeEditorFileTree';
import CoderEditorCollapseButton from './CoderEditorCollapseButton';
import composeFileTree from './utils/composeFileTree';

interface Props {
  data: Array<File>;
  onFileSelect: (index: number) => void;
}

const CodeEditorFileExplorer = ({ data, onFileSelect }: Props) => {
  const [ key, setKey ] = React.useState(0);
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

  const handleCollapseButtonClick = React.useCallback(() => {
    setKey((prev) => prev + 1);
  }, []);

  return (
    <Box pb="22px">
      <CoderEditorCollapseButton onClick={ handleCollapseButtonClick } label="Collapse folders"/>
      <CodeEditorFileTree key={ key } tree={ tree } onItemClick={ handleFileClick } isCollapsed={ key > 0 }/>
    </Box>
  );
};

export default React.memo(CodeEditorFileExplorer);
