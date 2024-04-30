import { Box, IconButton, Image, Link, LinkBox, Skeleton, useColorModeValue, chakra, Flex } from '@chakra-ui/react';
import type { MouseEvent } from 'react';
import React, { useCallback } from 'react';

import type { MarketplaceAppPreview } from 'types/client/marketplace';

import IconSvg from 'ui/shared/IconSvg';

import MarketplaceAppCardLink from './MarketplaceAppCardLink';
import MarketplaceAppIntegrationIcon from './MarketplaceAppIntegrationIcon';

interface Props extends MarketplaceAppPreview {
  onInfoClick: (id: string) => void;
  isFavorite: boolean;
  onFavoriteClick: (id: string, isFavorite: boolean) => void;
  isLoading: boolean;
  onAppClick: (event: MouseEvent, id: string) => void;
  className?: string;
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
      padding={{ base: 3, sm: '20px' }}
      border="1px"
      borderColor={ useColorModeValue('gray.200', 'gray.600') }
      role="group"
    >
      <Flex
        flexDirection={{ base: 'row', sm: 'column' }}
        height="100%"
        alignContent="start"
        gap={{ base: 4, sm: 0 }}
      >
        <Flex
          display={{ base: 'flex', sm: 'contents' }}
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
        >
          <Skeleton
            isLoaded={ !isLoading }
            marginBottom={ 4 }
            w={{ base: '64px', sm: '96px' }}
            h={{ base: '64px', sm: '96px' }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            order={{ base: 'auto', sm: 1 }}
          >
            <Image
              src={ isLoading ? undefined : logoUrl }
              alt={ `${ title } app icon` }
              borderRadius="8px"
            />
          </Skeleton>

          { !isLoading && (
            <Box
              display="flex"
              marginTop={{ base: 0, sm: 'auto' }}
              paddingTop={{ base: 0, sm: 4 }}
              order={{ base: 'auto', sm: 5 }}
            >
              <Link
                fontSize={{ base: 'xs', sm: 'sm' }}
                fontWeight="500"
                paddingRight={{ sm: 2 }}
                href="#"
                onClick={ handleInfoClick }
              >
                More info
              </Link>
            </Box>
          ) }
        </Flex>

        <Flex
          display={{ base: 'flex', sm: 'contents' }}
          flexDirection="column"
          gap={ 2 }
        >
          <Skeleton
            isLoaded={ !isLoading }
            marginBottom={{ base: 0, sm: 2 }}
            fontSize={{ base: 'sm', sm: 'lg' }}
            lineHeight={{ base: '20px', sm: '28px' }}
            paddingRight={{ base: '25px', sm: 0 }}
            fontWeight="semibold"
            fontFamily="heading"
            display="inline-block"
            order={{ base: 'auto', sm: 2 }}
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
            lineHeight="16px"
            order={{ base: 'auto', sm: 3 }}
          >
            <span>{ categoriesLabel }</span>
          </Skeleton>

          <Skeleton
            isLoaded={ !isLoading }
            fontSize={{ base: 'xs', sm: 'sm' }}
            lineHeight="20px"
            noOfLines={ 3 }
            order={{ base: 'auto', sm: 4 }}
          >
            { shortDescription }
          </Skeleton>
        </Flex>

        { !isLoading && (
          <IconButton
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="absolute"
            right={{ base: 1, sm: '10px' }}
            top={{ base: 1, sm: '10px' }}
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
    </LinkBox>
  );
};

export default React.memo(chakra(MarketplaceAppCard));
