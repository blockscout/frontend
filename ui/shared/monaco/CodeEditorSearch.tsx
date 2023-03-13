import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Input } from '@chakra-ui/react';
import React from 'react';

import type { File, Monaco, SearchResult } from './types';

import useDebounce from 'lib/hooks/useDebounce';

import CodeEditorSearchResultItem from './CodeEditorSearchResultItem';

interface Props {
  data: Array<File>;
  monaco: Monaco | undefined;
  onFileSelect: (index: number, lineNumber?: number) => void;
}

const CodeEditorSearch = ({ monaco, data, onFileSelect }: Props) => {
  const [ searchTerm, changeSearchTerm ] = React.useState('');
  const [ searchResults, setSearchResults ] = React.useState<Array<SearchResult>>([]);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  React.useEffect(() => {
    if (!monaco) {
      return;
    }

    if (!debouncedSearchTerm) {
      setSearchResults([]);
    }

    const result: Array<SearchResult> = monaco.editor.getModels()
      .map((model) => {
        const matches = model.findMatches(debouncedSearchTerm, false, false, false, null, false);
        return {
          file_path: model.uri.path,
          matches: matches.map(({ range }) => ({ ...range, lineContent: model.getLineContent(range.startLineNumber) })),
        };
      })
      .filter(({ matches }) => matches.length > 0);

    setSearchResults(result.length > 0 ? result : []);
  }, [ debouncedSearchTerm, monaco ]);

  const handleSearchTermChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    changeSearchTerm(event.target.value);
  }, []);

  const handleFileLineClick = React.useCallback((event: React.MouseEvent) => {
    const filePath = (event.currentTarget as HTMLDivElement).getAttribute('data-file-path');
    const lineNumber = (event.currentTarget as HTMLDivElement).getAttribute('data-line-number');
    const fileIndex = data.findIndex((item) => item.file_path === filePath);

    if (fileIndex > -1) {
      onFileSelect(fileIndex, Number(lineNumber));
    }
  }, [ data, onFileSelect ]);

  return (
    <Box>
      <Input size="xs" onChange={ handleSearchTermChange } value={ searchTerm } placeholder="Search"/>
      <Accordion
        key={ debouncedSearchTerm }
        allowMultiple
        defaultIndex={ searchResults.map((item, index) => index) }
        reduceMotion
        mt={ 3 }
      >
        {
          searchResults.map((item, index) => {
            const fileName = item.file_path.split('/').at(-1);
            return (
              <AccordionItem key={ index } borderWidth="0px" _last={{ borderBottomWidth: '0px' }}>
                <AccordionButton p={ 0 } _hover={{ bgColor: 'inherit' }} fontSize="sm">
                  <AccordionIcon/>
                  <span>{ fileName }</span>
                </AccordionButton>
                <AccordionPanel p={ 0 }>
                  { item.matches.map((match) => (
                    <CodeEditorSearchResultItem
                      key={ item.file_path + '_' + match.startLineNumber + '_' + match.startColumn }
                      filePath={ item.file_path }
                      onClick={ handleFileLineClick }
                      { ...match }
                    />
                  ),
                  ) }
                </AccordionPanel>
              </AccordionItem>
            );
          })
        }
      </Accordion>
    </Box>
  );
};

export default React.memo(CodeEditorSearch);
