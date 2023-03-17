import { Accordion, Box, Input, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { File, Monaco, SearchResult } from './types';

import useDebounce from 'lib/hooks/useDebounce';

import CodeEditorSearchSection from './CodeEditorSearchSection';
import CoderEditorCollapseButton from './CoderEditorCollapseButton';
import useColors from './utils/useColors';

interface Props {
  data: Array<File>;
  monaco: Monaco | undefined;
  onFileSelect: (index: number, lineNumber?: number) => void;
  isInputStuck: boolean;
}

const CodeEditorSearch = ({ monaco, data, onFileSelect, isInputStuck }: Props) => {
  const [ searchTerm, changeSearchTerm ] = React.useState('');
  const [ searchResults, setSearchResults ] = React.useState<Array<SearchResult>>([]);
  const [ expandedSections, setExpandedSections ] = React.useState<Array<number>>([]);

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

  React.useEffect(() => {
    setExpandedSections(searchResults.map((item, index) => index));
  }, [ searchResults ]);

  const handleSearchTermChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    changeSearchTerm(event.target.value);
  }, []);

  const handleResultItemClick = React.useCallback((filePath: string, lineNumber: number) => {
    const fileIndex = data.findIndex((item) => item.file_path === filePath);
    if (fileIndex > -1) {
      onFileSelect(fileIndex, Number(lineNumber));
    }
  }, [ data, onFileSelect ]);

  const handleAccordionStateChange = React.useCallback((newValue: Array<number>) => {
    setExpandedSections(newValue);
  }, []);

  const handleToggleCollapseClick = React.useCallback(() => {
    if (expandedSections.length === 0) {
      setExpandedSections(searchResults.map((item, index) => index));
    } else {
      setExpandedSections([]);
    }
  }, [ expandedSections.length, searchResults ]);

  const inputColor = useColorModeValue('rgb(97, 97, 97)', 'rgb(204, 204, 204)');
  const inputBgColor = useColorModeValue('white', 'rgb(60, 60, 60)');
  const inputFocusBorderColor = useColorModeValue('#0090f1', '#007fd4');
  const colors = useColors();

  return (
    <Box>
      <CoderEditorCollapseButton
        onClick={ handleToggleCollapseClick }
        label={ expandedSections.length === 0 ? 'Expand all' : 'Collapse all' }
        isDisabled={ searchResults.length === 0 }
        isCollapsed={ expandedSections.length === 0 }
      />
      <Box px={ 2 } position="sticky" top="35px" left="0" zIndex="2" bgColor={ colors.panels.bgColor } pb="8px" boxShadow={ isInputStuck ? 'md' : 'none' }>
        <Input
          size="xs"
          onChange={ handleSearchTermChange }
          value={ searchTerm }
          placeholder="Search"
          variant="unstyled"
          color={ inputColor }
          bgColor={ inputBgColor }
          borderRadius="none"
          fontSize="13px"
          lineHeight="19px"
          borderWidth="1px"
          borderColor={ inputBgColor }
          py="2px"
          px="4px"
          transitionDuration="0"
          _focus={{
            borderColor: inputFocusBorderColor,
          }}
        />
      </Box>
      <Accordion
        key={ debouncedSearchTerm }
        allowMultiple
        index={ expandedSections }
        onChange={ handleAccordionStateChange }
        reduceMotion
        mt={ 3 }
      >
        { searchResults.map((item) => <CodeEditorSearchSection key={ item.file_path } data={ item } onItemClick={ handleResultItemClick }/>) }
      </Accordion>
    </Box>
  );
};

export default React.memo(CodeEditorSearch);
