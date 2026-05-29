// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { MarketplaceApp } from 'src/features/marketplace/types/client';

import { route } from 'nextjs-routes';

import SearchBarSuggestItemLink from 'src/slices/search/components/search-bar/SearchBarSuggest/SearchBarSuggestItemLink';

import highlightText from 'src/shared/texts/highlight-text';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { useColorModeValue } from 'src/toolkit/chakra/color-mode';
import { Image } from 'src/toolkit/chakra/image';

interface Props {
  data: MarketplaceApp;
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
            { data.external && <SpriteIcon name="link_external" color="icon.secondary" boxSize={ 3 } verticalAlign="middle" flexShrink={ 0 }/> }
          </Flex>
          <Text
            color="text.secondary"
            lineClamp={ 3 }
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
          color="text.secondary"
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          flexGrow={ 1 }
        >
          { data.description }
        </Text>
        { data.external && (
          <SpriteIcon
            name="link_external"
            color="icon.secondary"
            boxSize={ 3 }
            verticalAlign="middle"
            flexShrink={ 0 }
          />
        ) }
      </Flex>
    );
  })();

  return (
    <SearchBarSuggestItemLink
      onClick={ onClick }
      href={ data.external ? route({ pathname: '/apps', query: { selectedAppId: data.id } }) : route({ pathname: '/apps/[id]', query: { id: data.id } }) }
      shallow={ data.external && router.pathname === '/apps' }
    >
      { content }
    </SearchBarSuggestItemLink>
  );
};

export default React.memo(SearchBarSuggestApp);
