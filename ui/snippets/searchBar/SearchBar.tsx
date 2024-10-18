import {
  Box,
  Portal,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverFooter,
  useDisclosure,
  useOutsideClick,
} from '@chakra-ui/react';
import _debounce from 'lodash/debounce';
import { useRouter } from 'next/router';
import type { FormEvent } from 'react';
import React from 'react';
import { Element } from 'react-scroll';

import type { Route } from 'nextjs-routes';
import { route } from 'nextjs-routes';

import useIsMobile from 'lib/hooks/useIsMobile';
import * as mixpanel from 'lib/mixpanel/index';
import { getRecentSearchKeywords, saveToRecentKeywords } from 'lib/recentSearchKeywords';
import Popover from 'ui/shared/chakra/Popover';
import LinkInternal from 'ui/shared/links/LinkInternal';

import SearchBarBackdrop from './SearchBarBackdrop';
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

  const { searchTerm, debouncedSearchTerm, handleSearchTermChange, query } = useQuickSearchQuery();

  const handleSubmit = React.useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm) {
      const resultRoute: Route = { pathname: '/search-results', query: { q: searchTerm, redirect: 'true' } };
      const url = route(resultRoute);
      mixpanel.logEvent(mixpanel.EventTypes.SEARCH_QUERY, {
        'Search query': searchTerm,
        'Source page type': mixpanel.getPageType(router.pathname),
        'Result URL': url,
      });
      saveToRecentKeywords(searchTerm);
      router.push(resultRoute, undefined, { shallow: true });
    }
  }, [ searchTerm, router ]);

  const handleFocus = React.useCallback(() => {
    onOpen();
  }, [ onOpen ]);

  const handelHide = React.useCallback(() => {
    onClose();
    inputRef.current?.querySelector('input')?.blur();
  }, [ onClose ]);

  const handleOutsideClick = React.useCallback((event: Event) => {
    const isFocusInInput = inputRef.current?.contains(event.target as Node);

    if (!isFocusInInput) {
      handelHide();
    }
  }, [ handelHide ]);

  useOutsideClick({ ref: menuRef, handler: handleOutsideClick });

  const handleClear = React.useCallback(() => {
    handleSearchTermChange('');
    inputRef.current?.querySelector('input')?.focus();
  }, [ handleSearchTermChange ]);

  const handleItemClick = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    mixpanel.logEvent(mixpanel.EventTypes.SEARCH_QUERY, {
      'Search query': searchTerm,
      'Source page type': mixpanel.getPageType(router.pathname),
      'Result URL': event.currentTarget.href,
    });
    saveToRecentKeywords(searchTerm);
    onClose();
  }, [ router.pathname, searchTerm, onClose ]);

  const menuPaddingX = isMobile && !isHomepage ? 24 : 0;
  const calculateMenuWidth = React.useCallback(() => {
    menuWidth.current = (inputRef.current?.getBoundingClientRect().width || 0) - menuPaddingX;
  }, [ menuPaddingX ]);

  // clear input on page change
  React.useEffect(() => {
    handleSearchTermChange('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ router.asPath?.split('?')?.[0] ]);

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
    <>
      <Popover
        isOpen={ isOpen && (searchTerm.trim().length > 0 || recentSearchKeywords.length > 0) }
        autoFocus={ false }
        onClose={ onClose }
        placement="bottom-start"
        offset={ isMobile && !isHomepage ? [ 12, -4 ] : [ 0, 8 ] }
        isLazy
      >
        <PopoverTrigger>
          <SearchBarInput
            ref={ inputRef }
            onChange={ handleSearchTermChange }
            onSubmit={ handleSubmit }
            onFocus={ handleFocus }
            onHide={ handelHide }
            onClear={ handleClear }
            isHomepage={ isHomepage }
            value={ searchTerm }
            isSuggestOpen={ isOpen }
          />
        </PopoverTrigger>
        <Portal>
          <PopoverContent
            w={ `${ menuWidth.current }px` }
            ref={ menuRef }
          >
            <PopoverBody
              p={ 0 }
              color="chakra-body-text"
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
        </Portal>
      </Popover>
      <SearchBarBackdrop isOpen={ isOpen }/>
    </>
  );
};

export default SearchBar;
