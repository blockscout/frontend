import { Accordion, Box, Input } from '@chakra-ui/react';
import React from 'react';

import type { File, Monaco, SearchResult } from './types';

import useDebounce from 'lib/hooks/useDebounce';

import CodeEditorSearchSection from './CodeEditorSearchSection';

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

  const handleResultItemClick = React.useCallback((filePath: string, lineNumber: number) => {
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
        { searchResults.map((item) => <CodeEditorSearchSection key={ item.file_path } data={ item } onItemClick={ handleResultItemClick }/>) }
      </Accordion>
    </Box>
  );
};

export default React.memo(CodeEditorSearch);
