// SPDX-License-Identifier: LicenseRef-Blockscout

import type { FormEvent, FocusEvent } from 'react';
import React from 'react';

import SearchBarBackdrop from 'src/slices/search/components/search-bar/SearchBarBackdrop';
import SearchBarInput from 'src/slices/search/components/search-bar/SearchBarInput';
import SearchBarRecentKeywords from 'src/slices/search/components/search-bar/SearchBarRecentKeywords';
import { getRecentSearchKeywords } from 'src/slices/search/utils/recent-search-keywords';

import useIsMobile from 'src/shared/hooks/useIsMobile';

import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'src/toolkit/chakra/popover';
import { useDisclosure } from 'src/toolkit/hooks/useDisclosure';

type Props = {
  searchTerm: string;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  handleSearchTermChange: (value: string) => void;
};

const SearchResultsInput = ({ searchTerm, handleSubmit, handleSearchTermChange }: Props) => {
  const { open, onClose, onOpen } = useDisclosure();
  const inputRef = React.useRef<HTMLFormElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const recentSearchKeywords = getRecentSearchKeywords();

  const handleOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    open && onOpen();
  }, [ onOpen ]);

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

  const isSuggestOpen = open && recentSearchKeywords.length > 0 && searchTerm.trim().length === 0;

  return (
    <>
      <PopoverRoot
        open={ isSuggestOpen }
        autoFocus={ false }
        onOpenChange={ handleOpenChange }
        positioning={{
          offset: { mainAxis: isMobile ? 0 : 8, crossAxis: isMobile ? 12 : 0 },
          sameWidth: true,
        }}
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
        <PopoverContent w="auto" maxW="100%" maxH={{ base: '300px', lg: '500px' }} overflowY="scroll" zIndex="modal" ref={ menuRef }>
          <PopoverBody py={ 6 }>
            <SearchBarRecentKeywords onClick={ handleSearchTermChange } onClear={ onClose }/>
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot>
      <SearchBarBackdrop isOpen={ isSuggestOpen }/>
    </>
  );
};

export default SearchResultsInput;
