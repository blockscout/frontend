import { Image, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import type { MarketplaceAppOverview } from 'types/client/marketplace';

import highlightText from 'lib/highlightText';

import SearchBarSuggestItemButton from './SearchBarSuggestItemButton';
import SearchBarSuggestItemLink from './SearchBarSuggestItemLink';
interface Props {
  data: MarketplaceAppOverview;
  isMobile: boolean | undefined;
  searchTerm: string;
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  handleData: (data: MarketplaceAppOverview) => void;
}

const SearchBarSuggestApp = ({ data, isMobile, searchTerm, onClick, handleData }: Props) => {

  const logo = (
    <Image
      borderRadius="base"
      boxSize={ 5 }
      src={ useColorModeValue(data.logo, data.logoDarkMode || data.logo) }
      alt={ `${ data.title } app icon` }
    />
  );

  const content = (() => {
    if (isMobile) {
      return (
        <>
          <Flex alignItems="center">
            { logo }
            <Text
              fontWeight={ 700 }
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              ml={ 2 }
            >
              <span dangerouslySetInnerHTML={{ __html: highlightText(data.title, searchTerm) }}/>
            </Text>
          </Flex>
          <Text
            variant="secondary"
            overflow="hidden"
            textOverflow="ellipsis"
            style={{
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              display: '-webkit-box',
            }}
          >
            { data.description }
          </Text>
        </>
      );
    }
    return (
      <Flex gap={ 2 } alignItems="center">
        { logo }
        <Text
          fontWeight={ 700 }
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          w="200px"
          flexShrink={ 0 }
        >
          <span dangerouslySetInnerHTML={{ __html: highlightText(data.title, searchTerm) }}/>
        </Text>
        <Text
          variant="secondary"
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          flexGrow={ 1 }
        >
          { data.description }
        </Text>
      </Flex>
    );
  })();

  if (data.external) {
    return (
      <SearchBarSuggestItemButton data={ data } handleData={ handleData }>
        { content }
      </SearchBarSuggestItemButton>
    );
  }

  return (
    <NextLink href={{ pathname: '/apps/[id]', query: { id: data.id } }} passHref legacyBehavior>
      <SearchBarSuggestItemLink onClick={ onClick }>
        { content }
      </SearchBarSuggestItemLink>
    </NextLink>
  );
};

export default React.memo(SearchBarSuggestApp);
