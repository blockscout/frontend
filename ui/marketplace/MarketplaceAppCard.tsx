import { Box, IconButton, Image, Link, LinkBox, Skeleton, useColorModeValue } from '@chakra-ui/react';
import type { MouseEvent } from 'react';
import React, { useCallback } from 'react';

import type { MarketplaceAppPreview } from 'types/client/marketplace';

import * as mixpanel from 'lib/mixpanel/index';
import IconSvg from 'ui/shared/IconSvg';

import MarketplaceAppCardLink from './MarketplaceAppCardLink';
import MarketplaceAppIntegrationIcon from './MarketplaceAppIntegrationIcon';

interface Props extends MarketplaceAppPreview {
  onInfoClick: (id: string) => void;
  isFavorite: boolean;
  onFavoriteClick: (id: string, isFavorite: boolean, source: 'Discovery view') => void;
  isLoading: boolean;
  onAppClick: (event: MouseEvent, id: string) => void;
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
}: Props) => {
  const categoriesLabel = categories.join(', ');

  const handleInfoClick = useCallback((event: MouseEvent) => {
    event.preventDefault();
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'More button', Info: id, Source: 'Discovery view' });
    onInfoClick(id);
  }, [ onInfoClick, id ]);

  const handleFavoriteClick = useCallback(() => {
    onFavoriteClick(id, isFavorite, 'Discovery view');
  }, [ onFavoriteClick, id, isFavorite ]);

  const logoUrl = useColorModeValue(logo, logoDarkMode || logo);

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
        display={{ base: 'grid', sm: 'flex' }}
        flexDirection="column"
        gridTemplateColumns={{ base: '64px 1fr', sm: '1fr' }}
        gridTemplateRows={{ base: 'none', sm: 'none' }}
        gridRowGap={{ base: 2, sm: 0 }}
        gridColumnGap={{ base: 4, sm: 0 }}
        height="100%"
        alignContent="start"
      >
        <Skeleton
          isLoaded={ !isLoading }
          gridRow={{ base: '1 / 4', sm: 'auto' }}
          marginBottom={ 4 }
          w={{ base: '64px', sm: '96px' }}
          h={{ base: '64px', sm: '96px' }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            src={ isLoading ? undefined : logoUrl }
            alt={ `${ title } app icon` }
            borderRadius="8px"
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
            onClick={ onAppClick }
          />
          <MarketplaceAppIntegrationIcon external={ external } internalWallet={ internalWallet }/>
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
          noOfLines={ 3 }
        >
          { shortDescription }
        </Skeleton>

        { !isLoading && (
          <Box
            display="flex"
            position={{ base: 'absolute', sm: 'relative' }}
            bottom={{ base: 3, sm: 0 }}
            left={{ base: 3, sm: 0 }}
            marginTop={{ base: 0, sm: 'auto' }}
            paddingTop={{ base: 0, sm: 4 }}
          >
            <Link
              fontSize={{ base: 'xs', sm: 'sm' }}
              paddingRight={{ sm: 2 }}
              href="#"
              onClick={ handleInfoClick }
            >
              More info
            </Link>
          </Box>
        ) }

        { !isLoading && (
          <IconButton
            display="block"
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
              <IconSvg name="star_filled" w={ 5 } h={ 5 } color="yellow.400"/> :
              <IconSvg name="star_outline" w={ 5 } h={ 5 } color="gray.400"/>
            }
          />
        ) }
      </Box>
    </LinkBox>
  );
};

export default React.memo(MarketplaceAppCard);
