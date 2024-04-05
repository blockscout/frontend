import { Link, Skeleton, useColorModeValue, LinkBox, Flex, Image, LinkOverlay, IconButton, Box, useBreakpointValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import type { MouseEvent } from 'react';
import React, { useCallback, useState } from 'react';

import type { MarketplaceAppPreview } from 'types/client/marketplace';

import config from 'configs/app';
import * as mixpanel from 'lib/mixpanel/index';
import { apps as appsMock } from 'mocks/apps/apps';
import IconSvg from 'ui/shared/IconSvg';

import MarketplaceAppCard from './MarketplaceAppCard';
import MarketplaceAppIntegrationIcon from './MarketplaceAppIntegrationIcon';

const feature = config.features.marketplace;

type BannerProps = {
  apps: Array<MarketplaceAppPreview>;
  favoriteApps: Array<string>;
  isLoading: boolean;
  onInfoClick: (id: string) => void;
  onFavoriteClick: (id: string, isFavorite: boolean, source: 'Banner') => void;
  onAppClick: (event: MouseEvent, id: string) => void;
}

type FeaturedAppProps = {
  app: MarketplaceAppPreview;
  isFavorite: boolean;
  isLoading: boolean;
  onInfoClick: (id: string) => void;
  onFavoriteClick: (id: string, isFavorite: boolean, source: 'Banner') => void;
  onAppClick: (event: MouseEvent, id: string) => void;
}

const FeaturedApp = ({
  app, isFavorite, isLoading, onAppClick,
  onInfoClick: onInfoClickProp, onFavoriteClick: onFavoriteClickProp,
}: FeaturedAppProps) => {
  const isMobile = useBreakpointValue({ base: true, sm: false });

  const { id, url, external, title, logo, logoDarkMode, shortDescription, categories, internalWallet } = app;
  const logoUrl = useColorModeValue(logo, logoDarkMode || logo);
  const categoriesLabel = categories.join(', ');

  const backgroundColor = useColorModeValue('purple.50', 'whiteAlpha.100');

  const onInfoClick = useCallback((id: string) => {
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'More button', Info: id, Source: 'Banner' });
    onInfoClickProp(id);
  }, [ onInfoClickProp ]);

  const onFavoriteClick = useCallback((id: string, isFavorite: boolean) => {
    onFavoriteClickProp(id, isFavorite, 'Banner');
  }, [ onFavoriteClickProp ]);

  const handleInfoClick = useCallback((event: MouseEvent) => {
    event.preventDefault();
    onInfoClick(id);
  }, [ onInfoClick, id ]);

  const handleFavoriteClick = useCallback(() => {
    onFavoriteClick(id, isFavorite);
  }, [ onFavoriteClick, id, isFavorite ]);

  if (isMobile) {
    return (
      <MarketplaceAppCard
        { ...app }
        onInfoClick={ onInfoClick }
        isFavorite={ isFavorite }
        onFavoriteClick={ onFavoriteClick }
        isLoading={ isLoading }
        onAppClick={ onAppClick }
        _hover={{ boxShadow: 'none' }}
        _focusWithin={{ boxShadow: 'none' }}
        border="none"
        background={ backgroundColor }
        mb={ 4 }
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
        mb={ 6 }
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
                icon={ isFavorite ?
                  <IconSvg name="star_filled" w={ 5 } h={ 5 } color="yellow.400"/> :
                  <IconSvg name="star_outline" w={ 5 } h={ 5 } color="gray.400"/>
                }
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

const IframeBanner = () => {
  const [ isFrameLoading, setIsFrameLoading ] = useState(true);

  const handleIframeLoad = useCallback(() => {
    setIsFrameLoading(false);
  }, []);

  if (!feature.isEnabled) {
    return null;
  }

  return (
    <Skeleton
      isLoaded={ !isFrameLoading }
      position="relative"
      h="136px"
      w="100%"
      borderRadius="md"
      mb={{ base: 4, sm: 6 }}
      overflow="hidden"
    >
      <Link
        href={ feature.banner?.linkUrl }
        target="_blank"
        rel="noopener noreferrer"
        position="absolute"
        w="100%"
        h="100%"
        top={ 0 }
        left={ 0 }
        zIndex={ 1 }
      />
      <Box
        as="iframe"
        h="100%"
        w="100%"
        src={ feature.banner?.contentUrl }
        title="Marketplace banner"
        onLoad={ handleIframeLoad }
      />
    </Skeleton>
  );
};

const Banner = ({ apps, favoriteApps, isLoading, onInfoClick, onFavoriteClick, onAppClick }: BannerProps) => {
  if (!feature.isEnabled) {
    return null;
  }

  if (feature.featuredApp) {
    const app = apps.find(app => app.id === feature.featuredApp);
    const isFavorite = favoriteApps.includes(feature.featuredApp);
    if (!isLoading && !app) {
      return null;
    }
    return (
      <FeaturedApp
        app={ app || appsMock[0] }
        isFavorite={ isFavorite }
        isLoading={ isLoading }
        onInfoClick={ onInfoClick }
        onFavoriteClick={ onFavoriteClick }
        onAppClick={ onAppClick }
      />
    );
  } else if (feature.banner) {
    return <IframeBanner/>;
  }

  return null;
};

export default Banner;
