import { Link, Skeleton, useColorModeValue, LinkBox, Flex, Image, LinkOverlay, IconButton } from '@chakra-ui/react';
import NextLink from 'next/link';
import type { MouseEvent } from 'react';
import React, { useCallback } from 'react';

import type { MarketplaceAppPreview } from 'types/client/marketplace';

import useIsMobile from 'lib/hooks/useIsMobile';
import * as mixpanel from 'lib/mixpanel/index';

import FavoriteIcon from '../FavoriteIcon';
import MarketplaceAppIntegrationIcon from '../MarketplaceAppIntegrationIcon';
import FeaturedAppMobile from './FeaturedAppMobile';

type FeaturedAppProps = {
  app: MarketplaceAppPreview;
  isFavorite: boolean;
  isLoading: boolean;
  onInfoClick: (id: string) => void;
  onFavoriteClick: (id: string, isFavorite: boolean, source: 'Banner') => void;
  onAppClick: (event: MouseEvent, id: string) => void;
};

const FeaturedApp = ({
  app, isFavorite, isLoading, onAppClick,
  onInfoClick, onFavoriteClick,
}: FeaturedAppProps) => {
  const isMobile = useIsMobile();

  const { id, url, external, title, logo, logoDarkMode, shortDescription, categories, internalWallet } = app;
  const logoUrl = useColorModeValue(logo, logoDarkMode || logo);
  const categoriesLabel = categories.join(', ');

  const backgroundColor = useColorModeValue('purple.50', 'whiteAlpha.100');

  const handleInfoClick = useCallback((event: MouseEvent) => {
    event.preventDefault();
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'More button', Info: id, Source: 'Banner' });
    onInfoClick(id);
  }, [ onInfoClick, id ]);

  const handleFavoriteClick = useCallback(() => {
    onFavoriteClick(id, isFavorite, 'Banner');
  }, [ onFavoriteClick, id, isFavorite ]);

  if (isMobile) {
    return (
      <FeaturedAppMobile
        { ...app }
        onInfoClick={ handleInfoClick }
        isFavorite={ isFavorite }
        onFavoriteClick={ handleFavoriteClick }
        isLoading={ isLoading }
        onAppClick={ onAppClick }
      />
    );
  }

  return (
    <LinkBox role="group">
      <Flex
        gap={ 6 }
        borderRadius="md"
        height="136px"
        padding={ 5 }
        background={ backgroundColor }
        mb={ 2 }
        mt={ 6 }
      >
        <Skeleton
          isLoaded={ !isLoading }
          w="96px"
          h="96px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            src={ isLoading ? undefined : logoUrl }
            alt={ `${ title } app icon` }
            borderRadius="md"
          />
        </Skeleton>

        <Flex flexDirection="column" flex={ 1 } gap={ 2 }>
          <Flex alignItems="center" gap={ 3 }>
            <Skeleton
              isLoaded={ !isLoading }
              fontSize="30px"
              fontWeight="semibold"
              fontFamily="heading"
              lineHeight="36px"
            >
              { external ? (
                <LinkOverlay href={ url } isExternal={ true } marginRight={ 2 }>
                  { title }
                </LinkOverlay>
              ) : (
                <NextLink href={{ pathname: '/apps/[id]', query: { id } }} passHref legacyBehavior>
                  <LinkOverlay marginRight={ 2 }>
                    { title }
                  </LinkOverlay>
                </NextLink>
              ) }
              <MarketplaceAppIntegrationIcon external={ external } internalWallet={ internalWallet }/>
            </Skeleton>

            <Skeleton
              isLoaded={ !isLoading }
              color="text_secondary"
              fontSize="xs"
              flex={ 1 }
            >
              <span>{ categoriesLabel }</span>
            </Skeleton>

            { !isLoading && (
              <Link
                fontSize="sm"
                fontWeight="500"
                href="#"
                onClick={ handleInfoClick }
              >
                More info
              </Link>
            ) }

            { !isLoading && (
              <IconButton
                display="flex"
                alignItems="center"
                aria-label="Mark as favorite"
                title="Mark as favorite"
                variant="ghost"
                colorScheme="gray"
                w={ 9 }
                h={ 8 }
                onClick={ handleFavoriteClick }
                icon={ <FavoriteIcon isFavorite={ isFavorite }/> }
              />
            ) }
          </Flex>

          <Skeleton
            isLoaded={ !isLoading }
            fontSize="sm"
            lineHeight="20px"
            noOfLines={ 2 }
          >
            { shortDescription }
          </Skeleton>
        </Flex>
      </Flex>
    </LinkBox>
  );
};

export default FeaturedApp;
