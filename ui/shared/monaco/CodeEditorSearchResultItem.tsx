import { Box } from '@chakra-ui/react';
import React from 'react';

import type { SearchResult } from './types';
import type ArrayElement from 'types/utils/ArrayElement';

interface Props extends ArrayElement<SearchResult['matches']> {
  filePath: string;
  onClick: (event: React.MouseEvent) => void;
}

const CodeEditorSearchResultItem = ({ lineContent, filePath, onClick, startLineNumber }: Props) => {
  return (
    <Box
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
      cursor="pointer"
      data-file-path={ filePath }
      data-line-number={ startLineNumber }
      onClick={ onClick }
    >
      { lineContent }
    </Box>
  );
};

export default React.memo(CodeEditorSearchResultItem);
