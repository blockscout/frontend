import { Box } from '@chakra-ui/react';
import React from 'react';

import type { File } from './types';

import CodeEditorFileTree from './CodeEditorFileTree';
import composeFileTree from './utils/composeFileTree';

interface Props {
  data: Array<File>;
}

const CodeEditorFileExplorer = ({ data }: Props) => {
  const tree = React.useMemo(() => {
    return composeFileTree(data);
  }, [ data ]);

  return (
    <Box>
      <CodeEditorFileTree tree={ tree }/>
    </Box>
  );
};

export default React.memo(CodeEditorFileExplorer);
