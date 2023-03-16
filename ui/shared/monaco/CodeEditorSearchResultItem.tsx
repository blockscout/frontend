import { Box, chakra } from '@chakra-ui/react';
import React from 'react';

import type { SearchResult } from './types';
import type ArrayElement from 'types/utils/ArrayElement';

interface Props extends ArrayElement<SearchResult['matches']> {
  filePath: string;
  onClick: (event: React.MouseEvent) => void;
}

const calculateStartPosition = (lineContent: string, startColumn: number) => {

  let start = 0;

  for (let index = 0; index < startColumn; index++) {
    const element = lineContent[index];

    if (element === ' ') {
      start = index + 1;
      continue;
    }
  }

  return start ? start - 1 : 0;
};

const CodeEditorSearchResultItem = ({ lineContent, filePath, onClick, startLineNumber, startColumn, endColumn }: Props) => {
  const start = calculateStartPosition(lineContent, startColumn);

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
      <span>{ lineContent.slice(start, startColumn - 1) }</span>
      <chakra.span bgColor="lime">{ lineContent.slice(startColumn - 1, endColumn - 1) }</chakra.span>
      <span>{ lineContent.slice(endColumn - 1) }</span>
    </Box>
  );
};

export default React.memo(CodeEditorSearchResultItem);
