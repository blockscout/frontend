import { Icon, Image, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import type { MarketplaceAppOverview } from 'types/client/marketplace';

import arrowIcon from 'icons/arrows/north-east.svg';
import highlightText from 'lib/highlightText';

import SearchBarSuggestItemLink from './SearchBarSuggestItemLink';

interface Props {
  data: MarketplaceAppOverview;
  isMobile: boolean | undefined;
  searchTerm: string;
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const SearchBarSuggestApp = ({ data, isMobile, searchTerm, onClick }: Props) => {

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
            { data.external && <Icon as={ arrowIcon } boxSize={ 4 } verticalAlign="middle"/> }
          </Flex>
          <Text
            variant="secondary"
            overflow="hidden"
            textOverflow="ellipsis"
            sx={{
              display: '-webkit-box',
              '-webkit-box-orient': 'vertical',
              '-webkit-line-clamp': '3',
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
        { data.external && <Icon as={ arrowIcon } boxSize={ 4 } verticalAlign="middle" color="text_secondary"/> }
      </Flex>
    );
  })();

  if (data.external) {
    return (
      <SearchBarSuggestItemLink onClick={ onClick } href={ data.url } target="_blank">
        { content }
      </SearchBarSuggestItemLink>
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
