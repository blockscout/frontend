import { chakra, Flex, Text } from '@chakra-ui/react';
import type { MouseEvent } from 'react';
import React, { useCallback } from 'react';

import type { MarketplaceApp } from 'types/client/marketplace';

import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { IconButton } from 'toolkit/chakra/icon-button';
import { Image } from 'toolkit/chakra/image';
import { Link, LinkBox } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { isBrowser } from 'toolkit/utils/isBrowser';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

import FavoriteIcon from './FavoriteIcon';
import MarketplaceAppCardLink from './MarketplaceAppCardLink';
import MarketplaceAppGraphLinks from './MarketplaceAppGraphLinks';
import MarketplaceAppIntegrationIcon from './MarketplaceAppIntegrationIcon';
import Rating from './Rating/Rating';

interface Props extends MarketplaceApp {
  onInfoClick: (id: string) => void;
  isFavorite: boolean;
  onFavoriteClick: (id: string, isFavorite: boolean) => void;
  isLoading: boolean;
  onAppClick: (event: MouseEvent, id: string) => void;
  className?: string;
  graphLinks?: Array<{ title: string; url: string }>;
}

const MarketplaceAppCard = ({
  id,
  url,
  external,
  title,
  logo,
  logoDarkMode,
  shortDescription,
  categories,
  onInfoClick,
  isFavorite,
  onFavoriteClick,
  isLoading,
  internalWallet,
  onAppClick,
  className,
  rating,
  ratingsTotalCount,
  userRating,
  graphLinks,
}: Props) => {
  const categoriesLabel = categories.join(', ');

  const handleInfoClick = useCallback((event: MouseEvent) => {
    event.preventDefault();
    onInfoClick(id);
  }, [ onInfoClick, id ]);

  const handleFavoriteClick = useCallback(() => {
    onFavoriteClick(id, isFavorite);
  }, [ onFavoriteClick, id, isFavorite ]);

  const logoUrl = useColorModeValue(logo, logoDarkMode || logo);

  return (
    <LinkBox
      className={ className }
      _hover={{
        boxShadow: isLoading ? 'none' : 'md',
      }}
      _focusWithin={{
        boxShadow: isLoading ? 'none' : 'md',
      }}
      borderRadius="md"
      padding={{ base: 3, md: '20px' }}
      borderWidth="1px"
      borderColor={{ _light: 'gray.200', _dark: 'gray.600' }}
    >
      <Flex
        flexDirection="column"
        height="100%"
        alignContent="start"
        gap={ 2 }
      >
        <Flex
          display={{ base: 'flex', md: 'contents' }}
          gap={ 4 }
        >
          <Skeleton
            loading={ isLoading }
            w={{ base: '64px', md: '96px' }}
            h={{ base: '64px', md: '96px' }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb={{ base: 0, md: 2 }}
          >
            <Image
              src={ isLoading ? undefined : logoUrl }
              alt={ `${ title } app icon` }
              borderRadius="8px"
            />
          </Skeleton>

          <Flex
            display={{ base: 'flex', md: 'contents' }}
            flexDirection="column"
            gap={ 2 }
            pt={ 1 }
          >
            <Skeleton
              loading={ isLoading }
              paddingRight={{ base: '40px', md: 0 }}
              display="inline-flex"
              alignItems="center"
            >
              <MarketplaceAppCardLink
                id={ id }
                url={ url }
                external={ external }
                title={ title }
                onClick={ onAppClick }
                fontWeight="semibold"
                fontFamily="heading"
                fontSize={{ base: 'sm', md: 'lg' }}
                lineHeight={{ base: '20px', md: '28px' }}
              />
              <MarketplaceAppIntegrationIcon external={ external } internalWallet={ internalWallet }/>
              <MarketplaceAppGraphLinks
                links={ graphLinks }
                ml={ 2 }
                verticalAlign="middle"
              />
            </Skeleton>

            <Skeleton
              loading={ isLoading }
              color="text.secondary"
              fontSize="xs"
              lineHeight="16px"
            >
              <span>{ categoriesLabel }</span>
            </Skeleton>
          </Flex>
        </Flex>

        <Skeleton
          loading={ isLoading }
          asChild
        >
          <Text lineClamp={{ base: 2, md: 3 }} textStyle="sm">
            { shortDescription }
          </Text>
        </Skeleton>

        { !isLoading && (
          <Flex
            alignItems="center"
            justifyContent="space-between"
            marginTop="auto"
            h="30px"
          >
            <Link
              textStyle="sm"
              fontWeight="500"
              paddingRight={ 3 }
              h="full"
              href="#"
              onClick={ handleInfoClick }
            >
              Info
            </Link>
            <Flex alignItems="center" gap={ 3 }>
              <Rating
                appId={ id }
                rating={ rating }
                ratingsTotalCount={ ratingsTotalCount }
                userRating={ userRating }
                isLoading={ isLoading }
                source="Discovery"
              />
              <Flex gap={ 2 }>
                <IconButton
                  aria-label="Mark as favorite"
                  title="Mark as favorite"
                  variant="icon_secondary"
                  size="md"
                  onClick={ handleFavoriteClick }
                  selected={ isFavorite }
                >
                  <FavoriteIcon isFavorite={ isFavorite }/>
                </IconButton>
                <CopyToClipboard
                  text={ isBrowser() ? window.location.origin + `/apps/${ id }` : '' }
                  type="share"
                  variant="icon_secondary"
                  size="md"
                  borderRadius="none"
                  ml={ 0 }
                  boxSize={ 8 }
                />
              </Flex>
            </Flex>
          </Flex>
        ) }
      </Flex>
    </LinkBox>
  );
};

export default React.memo(chakra(MarketplaceAppCard));
