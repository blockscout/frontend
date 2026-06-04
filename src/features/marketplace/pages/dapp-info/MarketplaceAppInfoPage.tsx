// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { route } from 'nextjs-routes';
import type { MouseEvent } from 'react';
import React from 'react';

import * as metadata from 'src/shell/metadata';

import useIsAuth from 'src/features/account/hooks/useIsAuth';

import config from 'src/config';
import throwOnAbsentParamError from 'src/shared/errors/throw-on-absent-param-error';
import throwOnResourceLoadError from 'src/shared/errors/throw-on-resource-load-error';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import CopyToClipboard from 'src/shared/texts/CopyToClipboard';
import type { IconName } from 'src/sprite/SpriteIcon';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Badge } from 'src/toolkit/chakra/badge';
import { Button } from 'src/toolkit/chakra/button';
import { useColorModeValue } from 'src/toolkit/chakra/color-mode';
import { Heading } from 'src/toolkit/chakra/heading';
import { IconButton } from 'src/toolkit/chakra/icon-button';
import { Image } from 'src/toolkit/chakra/image';
import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { nbsp } from 'src/toolkit/utils/htmlEntities';
import { isBrowser } from 'src/toolkit/utils/isBrowser';
import { makePrettyLink } from 'src/toolkit/utils/url';

import MarketplaceDisclaimerModal from '../../components/MarketplaceDisclaimerModal';
import Rating from '../../components/rating/MarketplaceRating';
import useAppQuery from '../../hooks/useAppQuery';
import useFavoriteApps from '../../hooks/useFavoriteApps';
import useGraphLinks from '../../hooks/useGraphLinks';
import { isDisclaimerShown } from '../../utils/disclaimer-modal';
import FavoriteIcon from '../index/FavoriteIcon';
import MarketplaceAppGraphLinks from '../index/MarketplaceAppGraphLinks';
import MarketplaceAppIntegrationIcon from '../index/MarketplaceAppIntegrationIcon';

const feature = config.features.marketplace;
const isRatingEnabled = feature.isEnabled && 'api' in feature;

export default function MarketplaceAppInfoPage() {
  const router = useRouter();
  const id = getQueryParamString(router.query.id);

  const [ isDisclaimerOpen, setIsDisclaimerOpen ] = React.useState(false);

  const isAuth = useIsAuth();
  const { favoriteApps, onFavoriteClick } = useFavoriteApps();
  const query = useAppQuery(id, isAuth);
  const graphLinksQuery = useGraphLinks();

  const { data, isPlaceholderData: isLoading } = query;
  const isFavorite = Boolean(data && favoriteApps.includes(data.id));
  const logoUrl = useColorModeValue(data?.logo ?? '', data?.logoDarkMode ?? data?.logo ?? '');

  const handleLaunchClick = React.useCallback((event: MouseEvent) => {
    if (!isDisclaimerShown()) {
      event.preventDefault();
      setIsDisclaimerOpen(true);
    }
  }, []);

  const handleDisclaimerClose = React.useCallback(() => {
    setIsDisclaimerOpen(false);
  }, []);

  const handleFavoriteClick = React.useCallback(() => {
    if (!data?.id) return;
    onFavoriteClick(data.id, isFavorite, 'App page');
  }, [ onFavoriteClick, data?.id, isFavorite ]);

  React.useEffect(() => {
    if (data && !isLoading) {
      metadata.update(
        { pathname: '/apps/[id]/info', query: { id: data.id } },
        data,
      );
    }
  }, [ data, isLoading ]);

  throwOnResourceLoadError(query);
  throwOnAbsentParamError(data);

  if (!feature.isEnabled || !data) {
    return null;
  }

  const graphLinks = graphLinksQuery.data?.[data.id];

  const socialLinks = [
    data.telegram ? { icon: 'social/telegram_filled' as IconName, url: data.telegram } : null,
    data.twitter ? { icon: 'social/twitter_filled' as IconName, url: data.twitter } : null,
    data.discord ? { icon: 'social/discord_filled' as IconName, url: data.discord } : null,
  ].filter(Boolean);

  if (data.github) {
    (Array.isArray(data.github) ? data.github : [ data.github ]).forEach((githubUrl) => {
      socialLinks.push({ icon: 'social/github_filled' as IconName, url: githubUrl });
    });
  }

  return (
    <>
      <Flex
        flexDirection={{ base: 'column', md: 'row' }}
        justifyContent="flex-start"
        alignItems="flex-start"
        columnGap={ 8 }
        rowGap={ 6 }
      >
        <Image
          src={ logoUrl || undefined }
          alt={ `${ data.title } app icon` }
          borderRadius="md"
          boxSize="144px"
        />
        <Box>
          <HStack>
            <Skeleton loading={ isLoading }>
              <Heading
                level="2"
              >
                { data.title }
              </Heading>
            </Skeleton>
            <MarketplaceAppIntegrationIcon external={ data.external } internalWallet={ data.internalWallet }/>
            <MarketplaceAppGraphLinks links={ graphLinks }/>
          </HStack>

          <Skeleton loading={ isLoading } mt={ 1 }>
            <Text
              color="text.secondary"
              textStyle="sm"
            >
              by{ nbsp }{ data.author }
            </Text>
          </Skeleton>

          { isRatingEnabled && (
            <Box
              mt={ 3 }
              py={ 2 }
              width="fit-content"
            >
              <Rating
                appId={ id }
                rating={ data.rating }
                ratingsTotalCount={ data.ratingsTotalCount }
                userRating={ data.userRating }
                fullView
                source="App page"
                isLoading={ isLoading }
              />
            </Box>
          ) }

          <HStack mt={ 3 }>
            <Link
              href={ data.external ? data.url : route({ pathname: '/apps/[id]', query: { id: data.id } }) }
              external={ data.external }
              noIcon
              onClick={ handleLaunchClick }
            >
              <Button size="sm">
                Launch app
              </Button>
            </Link>

            <IconButton
              aria-label="Mark as favorite"
              title="Mark as favorite"
              variant="icon_background"
              size="md"
              onClick={ handleFavoriteClick }
              selected={ isFavorite }
            >
              <FavoriteIcon isFavorite={ isFavorite }/>
            </IconButton>

            <CopyToClipboard
              text={ isBrowser() ? window.location.origin + `/apps/${ id }` : '' }
              type="share"
              variant="icon_background"
              size="md"
              ml={ 0 }
              boxSize={ 8 }
              borderRadius="base"
            />
          </HStack>

          <Skeleton loading={ isLoading } mt={ 6 }>
            <Text textStyle={{ base: 'sm', md: 'md' }}>{ data.description }</Text>
          </Skeleton>

          <HStack mt={ 6 }>
            { data.categories.map((category) => <Badge key={ category } loading={ isLoading }> { category } </Badge>) }
          </HStack>

          <Flex
            flexDirection={{ base: 'column', md: 'row' }}
            justifyContent={{ base: 'flex-start', md: 'space-between' }}
            alignItems="flex-start"
            gap={ 3 }
          >

            <HStack gap={ 3 } mt={ 4 }>
              { data.site && (
                <Link
                  external
                  href={ data.site }
                  display="flex"
                  alignItems="center"
                  textStyle="sm"
                  loading={ isLoading }
                >
                  <SpriteIcon
                    name="link"
                    display="inline"
                    verticalAlign="baseline"
                    boxSize="18px"
                    marginRight={ 2 }
                  />
                  <Text
                    color="inherit"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    { makePrettyLink(data.site)?.domain }
                  </Text>
                </Link>
              ) }

              { socialLinks.map(({ icon, url: socialUrl }) => (
                <Link
                  key={ socialUrl }
                  aria-label={ `Link to ${ socialUrl }` }
                  title={ socialUrl }
                  href={ socialUrl }
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  external
                  noIcon
                  flexShrink={ 0 }
                  loading={ isLoading }
                >
                  <SpriteIcon
                    name={ icon }
                    color="icon.secondary"
                    boxSize={ 5 }
                  />
                </Link>
              )) }
            </HStack>
          </Flex>
        </Box>
      </Flex>

      <MarketplaceDisclaimerModal
        isOpen={ isDisclaimerOpen }
        onClose={ handleDisclaimerClose }
        appId={ data.id }
        external={ data.external }
        url={ data.url }
      />
    </>
  );
}
