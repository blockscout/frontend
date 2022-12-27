import { Popover, PopoverTrigger, PopoverContent, PopoverBody, useDisclosure } from '@chakra-ui/react';
import type { FormEvent, FocusEvent } from 'react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import link from 'lib/link/link';

import SearchBarInput from './SearchBarInput';
import SearchBarSuggest from './SearchBarSuggest';
import useSearchQuery from './useSearchQuery';

type Props = {
  withShadow?: boolean;
  isHomepage?: boolean;
}

const SearchBar = ({ isHomepage, withShadow }: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const inputRef = React.useRef<HTMLFormElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const menuWidth = React.useRef<number>(0);
  const isMobile = useIsMobile();

  const { searchTerm, handleSearchTermChange, query } = useSearchQuery();

  const handleSubmit = React.useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm) {
      const url = link('search_results', undefined, { q: searchTerm });
      window.location.assign(url);
    }
  }, [ searchTerm ]);

  const handleFocus = React.useCallback(() => {
    onOpen();
  }, [ onOpen ]);

  const handleBlur = React.useCallback((event: FocusEvent<HTMLFormElement>) => {
    const isFocusInMenu = menuRef.current?.contains(event.relatedTarget);
    if (!isFocusInMenu) {
      onClose();
    }
  }, [ onClose ]);

  const menuPaddingX = isMobile && !isHomepage ? 32 : 0;
  const calculateMenuWidth = React.useCallback(() => {
    menuWidth.current = (inputRef.current?.getBoundingClientRect().width || 0) - menuPaddingX;
  }, [ menuPaddingX ]);

  React.useEffect(() => {
    calculateMenuWidth();
    window.addEventListener('resize', calculateMenuWidth);
    return function cleanup() {
      window.removeEventListener('resize', calculateMenuWidth);
    };
  }, [ calculateMenuWidth ]);

  return (
    <Popover
      isOpen={ isOpen && searchTerm.trim().length > 0 }
      autoFocus={ false }
      onClose={ onClose }
      placement="bottom-start"
      offset={ isMobile && !isHomepage ? [ 16, -12 ] : undefined }
    >
      <PopoverTrigger>
        <SearchBarInput
          ref={ inputRef }
          onChange={ handleSearchTermChange }
          onSubmit={ handleSubmit }
          onFocus={ handleFocus }
          onBlur={ handleBlur }
          isHomepage={ isHomepage }
          withShadow={ withShadow }
          value={ searchTerm }
        />
      </PopoverTrigger>
      <PopoverContent w={ `${ menuWidth.current }px` } maxH={{ base: '300px', lg: '500px' }} overflowY="scroll" ref={ menuRef }>
        <PopoverBody py={ 6 }>
          <SearchBarSuggest query={ query }/>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default SearchBar;
