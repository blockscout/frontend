import { Box, Icon, IconButton, Image, Link, LinkBox, Skeleton, useColorModeValue } from '@chakra-ui/react';
import type { MouseEvent } from 'react';
import React, { useCallback } from 'react';

import type { MarketplaceAppPreview } from 'types/client/marketplace';

import northEastIcon from 'icons/arrows/north-east.svg';
import starFilledIcon from 'icons/star_filled.svg';
import starOutlineIcon from 'icons/star_outline.svg';

import MarketplaceAppCardLink from './MarketplaceAppCardLink';

interface Props extends MarketplaceAppPreview {
  onInfoClick: (id: string) => void;
  isFavorite: boolean;
  onFavoriteClick: (id: string, isFavorite: boolean) => void;
  isLoading: boolean;
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
  const moreButtonBgGradient = `linear(to-r, ${ useColorModeValue('whiteAlpha.50', 'blackAlpha.50') }, ${ useColorModeValue('white', 'black') } 20%)`;

  return (
    <LinkBox
      _hover={{
        boxShadow: isLoading ? 'none' : 'md',
      }}
      _focusWithin={{
        boxShadow: isLoading ? 'none' : 'md',
      }}
      borderRadius="md"
      height="100%"
      padding={{ base: 3, sm: '20px' }}
      border="1px"
      borderColor={ useColorModeValue('gray.200', 'gray.600') }
      role="group"
    >
      <Box
        display={{ base: 'grid', sm: 'block' }}
        gridTemplateColumns={{ base: '64px 1fr', sm: '1fr' }}
        gridTemplateRows={{ base: 'none', sm: 'none' }}
        gridRowGap={{ base: 2, sm: 'none' }}
        gridColumnGap={{ base: 4, sm: 'none' }}
        height="100%"
      >
        <Skeleton
          isLoaded={ !isLoading }
          gridRow={{ base: '1 / 4', sm: 'auto' }}
          marginBottom={ 4 }
          w={{ base: '64px', sm: '96px' }}
          h={{ base: '64px', sm: '96px' }}
          borderRadius={ 8 }
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            src={ isLoading ? undefined : logoUrl }
            alt={ `${ title } app icon` }
          />
        </Skeleton>

        <Skeleton
          isLoaded={ !isLoading }
          gridColumn={{ base: 2, sm: 'auto' }}
          as="h3"
          marginBottom={{ base: 0, sm: 2 }}
          fontSize={{ base: 'sm', sm: 'lg' }}
          fontWeight="semibold"
          fontFamily="heading"
          display="inline-block"
        >
          <MarketplaceAppCardLink
            id={ id }
            url={ url }
            external={ external }
            title={ title }
          />
        </Skeleton>

        <Skeleton
          isLoaded={ !isLoading }
          marginBottom={{ base: 0, sm: 2 }}
          color="text_secondary"
          fontSize="xs"
        >
          <span>{ categoriesLabel }</span>
        </Skeleton>

        <Skeleton
          isLoaded={ !isLoading }
          fontSize={{ base: 'xs', sm: 'sm' }}
          lineHeight="20px"
          noOfLines={ 4 }
        >
          { shortDescription }
        </Skeleton>

        { !isLoading && (
          <Box
            position="absolute"
            right={{ base: 3, sm: '20px' }}
            bottom={{ base: 3, sm: '20px' }}
            paddingLeft={ 8 }
            bgGradient={ moreButtonBgGradient }
          >
            <Link
              fontSize={{ base: 'xs', sm: 'sm' }}
              display="flex"
              alignItems="center"
              paddingRight={{ sm: 2 }}
              maxW="100%"
              overflow="hidden"
              href="#"
              onClick={ handleInfoClick }
            >
            More

              <Icon
                as={ northEastIcon }
                marginLeft={ 1 }
              />
            </Link>
          </Box>
        ) }

        { !isLoading && (
          <IconButton
            display={{ base: 'block', sm: isFavorite ? 'block' : 'none' }}
            _groupHover={{ display: 'block' }}
            position="absolute"
            right={{ base: 3, sm: '10px' }}
            top={{ base: 3, sm: '14px' }}
            aria-label="Mark as favorite"
            title="Mark as favorite"
            variant="ghost"
            colorScheme="gray"
            w={ 9 }
            h={ 8 }
            onClick={ handleFavoriteClick }
            icon={ isFavorite ?
              <Icon as={ starFilledIcon } w={ 4 } h={ 4 } color="yellow.400"/> :
              <Icon as={ starOutlineIcon } w={ 4 } h={ 4 } color="gray.300"/>
            }
          />
        ) }
      </Box>
    </LinkBox>
  );
};

export default React.memo(MarketplaceAppCard);
