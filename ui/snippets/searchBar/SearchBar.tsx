import { Box, Popover, PopoverTrigger, PopoverContent, PopoverBody, useDisclosure, PopoverFooter } from '@chakra-ui/react';
import _debounce from 'lodash/debounce';
import { useRouter } from 'next/router';
import type { FormEvent, FocusEvent } from 'react';
import React from 'react';
import { Element } from 'react-scroll';

import { route } from 'nextjs-routes';

import useIsMobile from 'lib/hooks/useIsMobile';
import * as mixpanel from 'lib/mixpanel/index';
import { getRecentSearchKeywords, saveToRecentKeywords } from 'lib/recentSearchKeywords';
import LinkInternal from 'ui/shared/LinkInternal';

import SearchBarInput from './SearchBarInput';
import SearchBarRecentKeywords from './SearchBarRecentKeywords';
import SearchBarSuggest from './SearchBarSuggest/SearchBarSuggest';
import useQuickSearchQuery from './useQuickSearchQuery';

type Props = {
  isHomepage?: boolean;
}

const SCROLL_CONTAINER_ID = 'search_bar_popover_content';

const SearchBar = ({ isHomepage }: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const inputRef = React.useRef<HTMLFormElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const menuWidth = React.useRef<number>(0);
  const isMobile = useIsMobile();
  const router = useRouter();

  const recentSearchKeywords = getRecentSearchKeywords();

  const { searchTerm, debouncedSearchTerm, handleSearchTermChange, query, pathname } = useQuickSearchQuery();

  const handleSubmit = React.useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm) {
      const url = route({ pathname: '/search-results', query: { q: searchTerm } });
      mixpanel.logEvent(mixpanel.EventTypes.SEARCH_QUERY, {
        'Search query': searchTerm,
        'Source page type': mixpanel.getPageType(pathname),
        'Result URL': url,
      });
      saveToRecentKeywords(searchTerm);
      router.push({ pathname: '/search-results', query: { q: searchTerm } }, undefined, { shallow: true });
    }
  }, [ searchTerm, pathname, router ]);

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

  const handleItemClick = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    mixpanel.logEvent(mixpanel.EventTypes.SEARCH_QUERY, {
      'Search query': searchTerm,
      'Source page type': mixpanel.getPageType(pathname),
      'Result URL': event.currentTarget.href,
    });
    saveToRecentKeywords(searchTerm);
    onClose();
  }, [ pathname, searchTerm, onClose ]);

  const menuPaddingX = isMobile && !isHomepage ? 32 : 0;
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

  return (
    <Popover
      isOpen={ isOpen && (searchTerm.trim().length > 0 || recentSearchKeywords.length > 0) }
      autoFocus={ false }
      onClose={ onClose }
      placement="bottom-start"
      offset={ isMobile && !isHomepage ? [ 16, -12 ] : undefined }
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
          isHomepage={ isHomepage }
          value={ searchTerm }
        />
      </PopoverTrigger>
      <PopoverContent
        w={ `${ menuWidth.current }px` }
        ref={ menuRef }
      >
        <PopoverBody
          p={ 0 }
          color="chakra-body-text"
          sx={
            isHomepage ? {
              mark: { bgColor: 'green.100' },
              '*::-webkit-scrollbar-thumb': { backgroundColor: 'blackAlpha.300' },
            } : {}
          }
        >
          <Box
            maxH="50vh"
            overflowY="auto"
            id={ SCROLL_CONTAINER_ID }
            ref={ scrollRef }
            as={ Element }
            px={ 4 }
          >
            { searchTerm.trim().length === 0 && recentSearchKeywords.length > 0 && (
              <SearchBarRecentKeywords onClick={ handleSearchTermChange } onClear={ onClose }/>
            ) }
            { searchTerm.trim().length > 0 && (
              <SearchBarSuggest
                query={ query }
                searchTerm={ debouncedSearchTerm }
                onItemClick={ handleItemClick }
                containerId={ SCROLL_CONTAINER_ID }
              />
            ) }
          </Box>
        </PopoverBody>
        { searchTerm.trim().length > 0 && query.data && query.data.length >= 50 && (
          <PopoverFooter>
            <LinkInternal
              href={ route({ pathname: '/search-results', query: { q: searchTerm } }) }
              fontSize="sm"
            >
              View all results
            </LinkInternal>
          </PopoverFooter>
        ) }
      </PopoverContent>
    </Popover>
  );
};

export default SearchBar;
