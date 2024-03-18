import { Popover, PopoverTrigger, PopoverContent, PopoverBody, useDisclosure, Box, useColorModeValue } from '@chakra-ui/react';
import _debounce from 'lodash/debounce';
import type { FormEvent, FocusEvent } from 'react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import { getRecentSearchKeywords } from 'lib/recentSearchKeywords';
import SearchBarInput from 'ui/snippets/searchBar/SearchBarInput';
import SearchBarRecentKeywords from 'ui/snippets/searchBar/SearchBarRecentKeywords';

type Props = {
  searchTerm: string;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  handleSearchTermChange: (value: string) => void;
}

const SearchResultsInput = ({ searchTerm, handleSubmit, handleSearchTermChange }: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const inputRef = React.useRef<HTMLFormElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const menuWidth = React.useRef<number>(0);
  const isMobile = useIsMobile();

  const backdropBgColor = useColorModeValue('blackAlpha.400', 'blackAlpha.600');

  const recentSearchKeywords = getRecentSearchKeywords();

  const handleFocus = React.useCallback(() => {
    onOpen();
  }, [ onOpen ]);

  const handelHide = React.useCallback(() => {
    onClose();
    inputRef.current?.querySelector('input')?.blur();
  }, [ onClose ]);

  const handleBlur = React.useCallback((event: FocusEvent<HTMLFormElement>) => {
    const isFocusInMenu = menuRef.current?.contains(event.relatedTarget);
    const isFocusInInput = inputRef.current?.contains(event.relatedTarget);
    if (!isFocusInMenu && !isFocusInInput) {
      onClose();
    }
  }, [ onClose ]);

  const handleClear = React.useCallback(() => {
    handleSearchTermChange('');
    inputRef.current?.querySelector('input')?.focus();
  }, [ handleSearchTermChange ]);

  const menuPaddingX = isMobile ? 32 : 0;
  const calculateMenuWidth = React.useCallback(() => {
    menuWidth.current = (inputRef.current?.getBoundingClientRect().width || 0) - menuPaddingX;
  }, [ menuPaddingX ]);

  React.useEffect(() => {
    const inputEl = inputRef.current;
    if (!inputEl) {
      return;
    }
    calculateMenuWidth();

    const resizeHandler = _debounce(calculateMenuWidth, 200);
    const resizeObserver = new ResizeObserver(resizeHandler);
    resizeObserver.observe(inputRef.current);

    return function cleanup() {
      resizeObserver.unobserve(inputEl);
    };
  }, [ calculateMenuWidth ]);

  const isSuggestOpen = isOpen && recentSearchKeywords.length > 0 && searchTerm.trim().length === 0;

  return (
    <>
      <Popover
        isOpen={ isSuggestOpen }
        autoFocus={ false }
        onClose={ onClose }
        placement="bottom-start"
        offset={ isMobile ? [ 16, -12 ] : undefined }
        isLazy
      >
        <PopoverTrigger>
          <SearchBarInput
            ref={ inputRef }
            onChange={ handleSearchTermChange }
            onSubmit={ handleSubmit }
            onFocus={ handleFocus }
            onBlur={ handleBlur }
            onHide={ handelHide }
            onClear={ handleClear }
            value={ searchTerm }
            isSuggestOpen={ isSuggestOpen }
          />
        </PopoverTrigger>
        <PopoverContent w={ `${ menuWidth.current }px` } maxH={{ base: '300px', lg: '500px' }} overflowY="scroll" ref={ menuRef }>
          <PopoverBody py={ 6 }>
            <SearchBarRecentKeywords onClick={ handleSearchTermChange } onClear={ onClose }/>
          </PopoverBody>
        </PopoverContent>
      </Popover>
      <Box
        position="fixed"
        top={ 0 }
        left={ 0 }
        w="100vw"
        h="100vh"
        bgColor={ backdropBgColor }
        zIndex="overlay"
        display={{ base: 'none', lg: isSuggestOpen ? 'block' : 'none' }}
      />
    </>
  );
};

export default SearchResultsInput;
