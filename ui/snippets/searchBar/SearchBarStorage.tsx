import {
  Box,
  Portal,
  Popover,
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

import { route } from 'nextjs-routes';

import * as mixpanel from 'lib/mixpanel/index';
import { getRecentSearchKeywords, saveToRecentKeywords } from 'lib/recentSearchKeywords';
import LinkInternal from 'ui/shared/links/LinkInternal';

import SearchBarBackdrop from './SearchBarBackdrop';
import SearchBarInputStorage from './SearchBarInputStorage';
import SearchBarRecentKeywords from './SearchBarRecentKeywords';
import SearchBarSuggestStorage from './SearchBarSuggest/SearchBarSuggestStorage';
import useQuickSearchQueryStorage from './useQuickSearchQueryStorage';

const SCROLL_CONTAINER_ID = 'search_bar_popover_content';

const SearchBarStorage = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const inputRef = React.useRef<HTMLFormElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const menuWidth = React.useRef<number>(0);
  const router = useRouter();

  const recentSearchKeywords = getRecentSearchKeywords();

  const { searchTerm, debouncedSearchTerm, handleSearchTermChange, query, pathname, type, setType } = useQuickSearchQueryStorage();

  const handleFocus = React.useCallback(() => {
    onOpen();
  }, [ onOpen ]);

  const handelHide = React.useCallback(() => {
    onClose();
    inputRef.current?.querySelector('input')?.blur();
  }, [ onClose ]);

  const handleSubmit = React.useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm) {
      saveToRecentKeywords(searchTerm);
      if (query.data && query.data.bucket.length) {
        handelHide();
        router.push({ pathname: '/bucket-details/[address]', query: { address: query.data.bucket[0].bucket_name } }, undefined, { shallow: true });
      } else if (query.data && query.data.object.length) {
        handelHide();
        router.push({ pathname: '/object-details/[address]', query: { address: query.data.object[0].object_name } }, undefined, { shallow: true });
      }
    }
  }, [ searchTerm, query.data, handelHide, router ]);

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
      'Source page type': mixpanel.getPageType(pathname),
      'Result URL': event.currentTarget.href,
    });
    saveToRecentKeywords(searchTerm);
    onClose();
  }, [ pathname, searchTerm, onClose ]);

  const menuPaddingX = 0;
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

  const showMoreClicked = React.useCallback(() => {
    if (type === 'default') {
      return false;
    } else {
      return true;
    }
  }, [ type ]);

  return (
    <>
      <Popover
        isOpen={ isOpen && (searchTerm.trim().length > 0 || recentSearchKeywords.length > 0) }
        autoFocus={ false }
        // onClose={ onClose }
        placement="bottom-start"
        isLazy
      >
        <PopoverTrigger>
          <SearchBarInputStorage
            ref={ inputRef }
            onChange={ handleSearchTermChange }
            onSubmit={ handleSubmit }
            onFocus={ handleFocus }
            onHide={ handelHide }
            onClear={ handleClear }
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
                  <SearchBarSuggestStorage
                    query={ query }
                    searchTerm={ debouncedSearchTerm }
                    onItemClick={ handleItemClick }
                    containerId={ SCROLL_CONTAINER_ID }
                    setType={ setType }
                    showMoreClicked={ showMoreClicked() }
                  />
                ) }
              </Box>
            </PopoverBody>
            { searchTerm.trim().length > 0 && query.data && query.data.length >= 50 && (
              <PopoverFooter>
                <LinkInternal
                  href={ route({ pathname: '/search-results', query: { q: searchTerm, type: 'storage' } }) }
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

export default SearchBarStorage;
