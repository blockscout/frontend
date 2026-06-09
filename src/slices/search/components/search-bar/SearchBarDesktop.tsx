// SPDX-License-Identifier: LicenseRef-Blockscout

import { useClickAway } from '@uidotdev/usehooks';
import { useRouter } from 'next/router';
import type { Route } from 'nextjs-routes';
import { route } from 'nextjs-routes';
import type { FormEvent } from 'react';
import React from 'react';

import { getRecentSearchKeywords, saveToRecentKeywords } from 'src/slices/search/utils/recent-search-keywords';

import useSearchWithClusters from 'src/features/name-services/clusters/hooks/useSearchWithClusters';

import * as mixpanel from 'src/services/mixpanel';
import useIsMobile from 'src/shared/hooks/useIsMobile';

import { Link } from 'src/toolkit/chakra/link';
import { PopoverBody, PopoverContent, PopoverFooter, PopoverRoot, PopoverTrigger } from 'src/toolkit/chakra/popover';
import { useDisclosure } from 'src/toolkit/hooks/useDisclosure';

import SearchBarBackdrop from './SearchBarBackdrop';
import SearchBarInput from './SearchBarInput';
import SearchBarRecentKeywords from './SearchBarRecentKeywords';
import SearchBarSuggest from './SearchBarSuggest/SearchBarSuggest';

type Props = {
  isHeroBanner?: boolean;
};

const SearchBarDesktop = ({ isHeroBanner }: Props) => {
  const inputRef = React.useRef<HTMLFormElement>(null);

  const { open, onClose, onOpen } = useDisclosure();
  const isMobile = useIsMobile();
  const router = useRouter();

  const recentSearchKeywords = getRecentSearchKeywords();

  const { searchTerm, debouncedSearchTerm, handleSearchTermChange, query, zetaChainCCTXQuery, externalSearchItem } = useSearchWithClusters();

  const navigateToResults = React.useCallback((redirect: boolean) => {
    if (searchTerm) {
      const resultRoute: Route = { pathname: '/search-results', query: { q: searchTerm, redirect: redirect ? 'true' : 'false' } };
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

  const handleSubmit = React.useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigateToResults(true);
  }, [ navigateToResults ]);

  const handleViewAllResultsClick = React.useCallback(() => {
    navigateToResults(false);
  }, [ navigateToResults ]);

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

  const menuRef = useClickAway<HTMLDivElement>(handleOutsideClick);

  const handleOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    open && onOpen();
  }, [ onOpen ]);

  const handleRecentKeywordsClick = React.useCallback((keyword: string) => {
    handleSearchTermChange(keyword);
    inputRef.current?.querySelector('input')?.focus();
  }, [ handleSearchTermChange ]);

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

  const handleBlur = React.useCallback((event: React.FocusEvent<HTMLFormElement>) => {
    const isFocusInMenu = menuRef.current?.contains(event.relatedTarget);
    const isFocusInInput = inputRef.current?.contains(event.relatedTarget);
    if (!isFocusInMenu && !isFocusInInput) {
      onClose();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ onClose ]);

  // clear input on page change
  React.useEffect(() => {
    handleSearchTermChange('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ router.asPath?.split('?')?.[0] ]);

  const showAllResultsLink = searchTerm.trim().length > 0 && (
    (query.data && query.data.length >= 50) ||
    (zetaChainCCTXQuery.data && zetaChainCCTXQuery.data?.items.length > 10)
  );

  return (
    <>
      <PopoverRoot
        open={ open && (searchTerm.trim().length > 0 || recentSearchKeywords.length > 0) }
        autoFocus={ false }
        onOpenChange={ handleOpenChange }
        positioning={{
          offset: isMobile && !isHeroBanner ? { mainAxis: 0, crossAxis: 12 } : { mainAxis: 8, crossAxis: 0 },
          sameWidth: true,
        }}
        lazyMount
        closeOnInteractOutside={ false }
      >
        <PopoverTrigger asChild>
          <SearchBarInput
            ref={ inputRef }
            onChange={ handleSearchTermChange }
            onSubmit={ handleSubmit }
            onFocus={ handleFocus }
            onHide={ handelHide }
            onBlur={ handleBlur }
            onClear={ handleClear }
            isHeroBanner={ isHeroBanner }
            value={ searchTerm }
            isSuggestOpen={ open }
          />
        </PopoverTrigger>
        <PopoverContent
          w="auto"
          maxW="100%"
          overflow="hidden"
          zIndex="modal"
          ref={ menuRef }
        >
          <PopoverBody
            px={ 4 }
            color="chakra-body-text"
            maxH="50vh"
            display="flex"
            flexDirection="column"
            overflowY="hidden"
          >
            { searchTerm.trim().length === 0 && recentSearchKeywords.length > 0 && (
              <SearchBarRecentKeywords onClick={ handleRecentKeywordsClick } onClear={ onClose }/>
            ) }
            { searchTerm.trim().length > 0 && (
              <SearchBarSuggest
                query={ query }
                searchTerm={ debouncedSearchTerm }
                onItemClick={ handleItemClick }
                zetaChainCCTXQuery={ zetaChainCCTXQuery }
                externalSearchItem={ externalSearchItem }
              />
            ) }
          </PopoverBody>
          { showAllResultsLink && (
            <PopoverFooter pt={ 2 } borderTopWidth={ 1 } borderColor="border.divider">
              <Link
                textStyle="sm"
                onClick={ handleViewAllResultsClick }
              >
                View all results
              </Link>
            </PopoverFooter>
          ) }
        </PopoverContent>
      </PopoverRoot>
      <SearchBarBackdrop isOpen={ open }/>
    </>
  );
};

export default SearchBarDesktop;
