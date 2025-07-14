import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { route } from 'nextjs-routes';

import * as mixpanel from 'lib/mixpanel/index';
import { getRecentSearchKeywords, saveToRecentKeywords } from 'lib/recentSearchKeywords';
import { Button } from 'toolkit/chakra/button';
import {
  DrawerRoot,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerCloseTrigger,
  DrawerBody,
  DrawerFooter,
} from 'toolkit/chakra/drawer';
import { Link } from 'toolkit/chakra/link';
import IconSvg from 'ui/shared/IconSvg';
import SearchBarInput from 'ui/snippets/searchBar/SearchBarInput';

import SearchBarRecentKeywords from './SearchBarRecentKeywords';
import SearchBarSuggest from './SearchBarSuggest/SearchBarSuggest';
import useQuickSearchQuery from './useQuickSearchQuery';

type Props = {
  isHeroBanner?: boolean;
};

const SCROLL_CONTAINER_ID = 'search_bar_drawer_content';

const SearchBarMobile = ({ isHeroBanner }: Props) => {
  const inputRef = React.useRef<HTMLFormElement>(null);
  const voidFn = React.useCallback(() => {}, []);
  const router = useRouter();

  const { searchTerm, debouncedSearchTerm, handleSearchTermChange, query } = useQuickSearchQuery();
  const recentSearchKeywords = getRecentSearchKeywords();

  const onTriggerClick = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleItemClick = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    mixpanel.logEvent(mixpanel.EventTypes.SEARCH_QUERY, {
      'Search query': searchTerm,
      'Source page type': mixpanel.getPageType(router.pathname),
      'Result URL': event.currentTarget.href,
    });
    saveToRecentKeywords(searchTerm);
  }, [ router.pathname, searchTerm ]);

  const handleClear = React.useCallback(() => {
    handleSearchTermChange('');
    inputRef.current?.querySelector('input')?.focus();
  }, [ handleSearchTermChange ]);

  let trigger: React.ReactNode | null = null;
  if (isHeroBanner) {
    trigger = (
      <SearchBarInput
        onChange={ voidFn }
        onSubmit={ voidFn }
        onFocus={ voidFn }
        onHide={ voidFn }
        onBlur={ voidFn }
        onClear={ voidFn }
        onFormClick={ onTriggerClick }
        isHeroBanner={ isHeroBanner }
        readOnly={ true }
      />
    );
  } else {
    trigger = (
      <Button
        variant="header"
        flexShrink={ 0 }
        p={ 0 }
      >
        <IconSvg
          name="search"
          boxSize={ 6 }
          flexShrink={ 0 }
        />
      </Button>
    );
  }

  return (
    <DrawerRoot placement="bottom">
      <DrawerTrigger asChild>
        { trigger }
      </DrawerTrigger>
      <DrawerContent h="95vh" overflowY="hidden">
        <DrawerHeader>
          <DrawerTitle>Search</DrawerTitle>
          <DrawerCloseTrigger/>
        </DrawerHeader>
        <DrawerBody py={ 0 }>
          <SearchBarInput
            ref={ inputRef }
            onChange={ handleSearchTermChange }
            onSubmit={ voidFn }
            onFocus={ voidFn }
            onHide={ voidFn }
            onBlur={ voidFn }
            onClear={ handleClear }
            onFormClick={ onTriggerClick }
            value={ searchTerm }
          />
          <Box
            w="100%"
            h="calc(100% - 56px)"
            overflowY="auto"
            id={ SCROLL_CONTAINER_ID }
          >
            { searchTerm.trim().length === 0 && recentSearchKeywords.length > 0 && (
              <SearchBarRecentKeywords onClick={ handleSearchTermChange }/>
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
        </DrawerBody>
        <DrawerFooter
          borderTop="1px solid"
          borderColor="border.divider"
          bg="background.primary"
          pt={ 3 }
          px={ 5 }
          pb={ 5 }
          justifyContent="center"
        >
          <Link
            href={ route({ pathname: '/search-results', query: { q: searchTerm } }) }
            textStyle="sm"
          >
            View all results
          </Link>
        </DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default SearchBarMobile;
