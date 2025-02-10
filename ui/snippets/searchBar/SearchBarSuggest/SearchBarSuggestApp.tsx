import { Image, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { MarketplaceAppOverview } from 'types/client/marketplace';

import highlightText from 'lib/highlightText';
import IconSvg from 'ui/shared/IconSvg';
import NextLink from 'ui/shared/NextLink';

import SearchBarSuggestItemLink from './SearchBarSuggestItemLink';
interface Props {
  data: MarketplaceAppOverview;
  isMobile: boolean | undefined;
  searchTerm: string;
  onClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const SearchBarSuggestApp = ({ data, isMobile, searchTerm, onClick }: Props) => {
  const router = useRouter();
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
            { data.external && <IconSvg name="link_external" color="icon_link_external" boxSize={ 3 } verticalAlign="middle" flexShrink={ 0 }/> }
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
        { data.external && (
          <IconSvg
            name="link_external"
            color="icon_link_external"
            boxSize={ 3 }
            verticalAlign="middle"
            flexShrink={ 0 }
          />
        ) }
      </Flex>
    );
  })();

  if (data.external) {
    return (
      <NextLink
        href={{
          pathname: '/apps',
          query: {
            selectedAppId: data.id,
          },
        }}
        passHref
        shallow={ router.pathname === '/apps' }
        legacyBehavior
      >
        <SearchBarSuggestItemLink onClick={ onClick }>
          { content }
        </SearchBarSuggestItemLink>
      </NextLink>

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
