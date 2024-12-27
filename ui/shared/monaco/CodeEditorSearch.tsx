import type { ChakraProps } from '@chakra-ui/react';
import { Accordion, Box, Input, InputGroup, InputRightElement, useBoolean } from '@chakra-ui/react';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React from 'react';

import type { File, Monaco, SearchResult } from './types';

import useDebounce from 'lib/hooks/useDebounce';

import CodeEditorSearchSection from './CodeEditorSearchSection';
import CoderEditorCollapseButton from './CoderEditorCollapseButton';
import useThemeColors from './utils/useThemeColors';

interface Props {
  data: Array<File>;
  monaco: Monaco | undefined;
  onFileSelect: (index: number, lineNumber?: number) => void;
  isInputStuck: boolean;
  isActive: boolean;
  setActionBarRenderer: React.Dispatch<React.SetStateAction<(() => React.JSX.Element) | undefined>>;
  defaultValue: string;
}

const CodeEditorSearch = ({ monaco, data, onFileSelect, isInputStuck, isActive, setActionBarRenderer, defaultValue }: Props) => {
  const [ searchTerm, changeSearchTerm ] = React.useState('');
  const [ searchResults, setSearchResults ] = React.useState<Array<SearchResult>>([]);
  const [ expandedSections, setExpandedSections ] = React.useState<Array<number>>([]);
  const [ isMatchCase, setMatchCase ] = useBoolean();
  const [ isMatchWholeWord, setMatchWholeWord ] = useBoolean();
  const [ isMatchRegex, setMatchRegex ] = useBoolean();
  const decorations = React.useRef<Record<string, Array<string>>>({});

  const themeColors = useThemeColors();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  React.useEffect(() => {
    changeSearchTerm(defaultValue);
  }, [ defaultValue ]);

  React.useEffect(() => {
    if (!monaco) {
      return;
    }

    if (!debouncedSearchTerm) {
      setSearchResults([]);
    }

    const models = monaco.editor.getModels();
    const matches = models.map((model) => model.findMatches(debouncedSearchTerm, false, isMatchRegex, isMatchCase, isMatchWholeWord ? 'true' : null, false));

    models.forEach((model, index) => {
      const filePath = model.uri.path;
      const prevDecorations = decorations.current[filePath] || [];
      const newDecorations: Array<monaco.editor.IModelDeltaDecoration> = matches[index].map(({ range }) => ({ range, options: { className: 'highlight' } }));

      const newDecorationsIds = model.deltaDecorations(prevDecorations, newDecorations);
      decorations.current[filePath] = newDecorationsIds;
    });

    const result: Array<SearchResult> = matches
      .map((match, index) => {
        const model = models[index];
        return {
          file_path: model.uri.path,
          matches: match.map(({ range }) => ({ ...range, lineContent: model.getLineContent(range.startLineNumber) })),
        };
      })
      .filter(({ matches }) => matches.length > 0);

    setSearchResults(result.length > 0 ? result : []);
  }, [ debouncedSearchTerm, isMatchCase, isMatchRegex, isMatchWholeWord, monaco ]);

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

  const renderActionBar = React.useCallback(() => {
    return (
      <CoderEditorCollapseButton
        onClick={ handleToggleCollapseClick }
        label={ expandedSections.length === 0 ? 'Expand all' : 'Collapse all' }
        isDisabled={ searchResults.length === 0 }
        isCollapsed={ expandedSections.length === 0 }
      />
    );
  }, [ expandedSections.length, handleToggleCollapseClick, searchResults.length ]);

  React.useEffect(() => {
    isActive && setActionBarRenderer(() => renderActionBar);
  }, [ isActive, renderActionBar, setActionBarRenderer ]);

  const buttonProps: ChakraProps = {
    boxSize: '20px',
    p: '1px',
    cursor: 'pointer',
    borderRadius: '3px',
    borderWidth: '1px',
    borderColor: 'transparent',
  };

  const searchResultNum = (() => {
    if (!debouncedSearchTerm) {
      return null;
    }

    const totalResults = searchResults.map(({ matches }) => matches.length).reduce((result, item) => result + item, 0);

    if (!totalResults) {
      return (
        <Box px="8px" fontSize="13px" lineHeight="18px" mb="8px">
          No results found. Review your settings for configured exclusions.
        </Box>
      );
    }

    return (
      <Box px="8px" fontSize="13px" lineHeight="18px" mb="8px">
        { totalResults } result{ totalResults > 1 ? 's' : '' } in { searchResults.length } file{ searchResults.length > 1 ? 's' : '' }
      </Box>
    );
  })();

  return (
    <Box>
      <InputGroup
        px="8px"
        position="sticky"
        top="35px"
        left="0"
        zIndex="2"
        bgColor={ themeColors['sideBar.background'] }
        pb="8px"
        boxShadow={ isInputStuck ? 'md' : 'none' }
      >
        <Input
          size="xs"
          onChange={ handleSearchTermChange }
          value={ searchTerm }
          placeholder="Search"
          variant="unstyled"
          color={ themeColors['input.foreground'] }
          bgColor={ themeColors['input.background'] }
          borderRadius="none"
          fontSize="13px"
          lineHeight="20px"
          borderWidth="1px"
          borderColor={ themeColors['input.background'] }
          py="2px"
          pl="4px"
          pr="75px"
          transitionDuration="0"
          _focus={{
            borderColor: themeColors.focusBorder,
          }}
        />
        <InputRightElement w="auto" h="auto" right="12px" top="3px" columnGap="2px">
          <Box
            { ...buttonProps }
            className="codicon codicon-case-sensitive"
            onClick={ setMatchCase.toggle }
            bgColor={ isMatchCase ? themeColors['custom.inputOption.activeBackground'] : 'transparent' }
            _hover={{ bgColor: isMatchCase ? themeColors['custom.inputOption.activeBackground'] : themeColors['custom.inputOption.hoverBackground'] }}
            title="Match Case"
            aria-label="Match Case"
          />
          <Box
            { ...buttonProps }
            className="codicon codicon-whole-word"
            bgColor={ isMatchWholeWord ? themeColors['custom.inputOption.activeBackground'] : 'transparent' }
            onClick={ setMatchWholeWord.toggle }
            _hover={{ bgColor: isMatchWholeWord ? themeColors['custom.inputOption.activeBackground'] : themeColors['custom.inputOption.hoverBackground'] }}
            title="Match Whole Word"
            aria-label="Match Whole Word"
          />
          <Box
            { ...buttonProps }
            className="codicon codicon-regex"
            bgColor={ isMatchRegex ? themeColors['custom.inputOption.activeBackground'] : 'transparent' }
            onClick={ setMatchRegex.toggle }
            _hover={{ bgColor: isMatchRegex ? themeColors['custom.inputOption.activeBackground'] : themeColors['custom.inputOption.hoverBackground'] }}
            title="Use Regular Expression"
            aria-label="Use Regular Expression"
          />
        </InputRightElement>
      </InputGroup>
      { searchResultNum }
      <Accordion
        key={ debouncedSearchTerm }
        allowMultiple
        index={ expandedSections }
        onChange={ handleAccordionStateChange }
        reduceMotion
      >
        { searchResults.map((item) => <CodeEditorSearchSection key={ item.file_path } data={ item } onItemClick={ handleResultItemClick }/>) }
      </Accordion>
    </Box>
  );
};

export default React.memo(CodeEditorSearch);
