import { AccordionButton, AccordionItem, AccordionIcon, AccordionPanel } from '@chakra-ui/react';
import React from 'react';

import type { SearchResult } from './types';

import CodeEditorSearchResultItem from './CodeEditorSearchResultItem';
import getFileName from './utils/getFileName';

interface Props {
  data: SearchResult;
  onItemClick: (filePath: string, lineNumber: number) => void;
}

const CodeEditorSearchSection = ({ data, onItemClick }: Props) => {
  const fileName = getFileName(data.file_path);

  const handleFileLineClick = React.useCallback((event: React.MouseEvent) => {
    const lineNumber = Number((event.currentTarget as HTMLDivElement).getAttribute('data-line-number'));
    if (!Object.is(lineNumber, NaN)) {
      onItemClick(data.file_path, Number(lineNumber));
    }
  }, [ data.file_path, onItemClick ]);

  return (
    <AccordionItem borderWidth="0px" _last={{ borderBottomWidth: '0px' }}>
      <AccordionButton p={ 0 } _hover={{ bgColor: 'inherit' }} fontSize="sm">
        <AccordionIcon/>
        <span>{ fileName }</span>
      </AccordionButton>
      <AccordionPanel p={ 0 }>
        { data.matches.map((match) => (
          <CodeEditorSearchResultItem
            key={ data.file_path + '_' + match.startLineNumber + '_' + match.startColumn }
            filePath={ data.file_path }
            onClick={ handleFileLineClick }
            { ...match }
          />
        ),
        ) }
      </AccordionPanel>
    </AccordionItem>
  );
};

export default React.memo(CodeEditorSearchSection);
