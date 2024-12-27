import { IconButton, Image, Link, LinkBox, Skeleton, useColorModeValue, Flex } from '@chakra-ui/react';
import type { MouseEvent } from 'react';
import React from 'react';

import type { MarketplaceAppPreview } from 'types/client/marketplace';

import FavoriteIcon from '../FavoriteIcon';
import MarketplaceAppCardLink from '../MarketplaceAppCardLink';
import MarketplaceAppIntegrationIcon from '../MarketplaceAppIntegrationIcon';

interface Props extends MarketplaceAppPreview {
  onInfoClick: (event: MouseEvent) => void;
  isFavorite: boolean;
  onFavoriteClick: () => void;
  isLoading: boolean;
  onAppClick: (event: MouseEvent, id: string) => void;
}

const FeaturedAppMobile = ({
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

  const logoUrl = useColorModeValue(logo, logoDarkMode || logo);

  return (
    <LinkBox
      borderRadius="md"
      padding={{ base: 3, sm: '20px' }}
      role="group"
      background={ useColorModeValue('purple.50', 'whiteAlpha.100') }
      mt={ 6 }
    >
      <Flex
        flexDirection="row"
        height="100%"
        alignContent="start"
        gap={ 4 }
      >
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="space-between"
        >
          <Skeleton
            isLoaded={ !isLoading }
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

          { !isLoading && (
            <Flex
              position={{ base: 'relative', sm: 'absolute' }}
              right={{ base: 0, sm: '50px' }}
              top={{ base: 0, sm: '24px' }}
            >
              <Link
                fontSize={{ base: 'xs', sm: 'sm' }}
                fontWeight="500"
                paddingRight={{ sm: 2 }}
                href="#"
                onClick={ onInfoClick }
              >
                More info
              </Link>
            </Flex>
          ) }
        </Flex>

        <Flex flexDirection="column" gap={ 2 }>
          <Skeleton
            isLoaded={ !isLoading }
            fontSize={{ base: 'sm', sm: 'lg' }}
            lineHeight={{ base: '20px', sm: '28px' }}
            paddingRight={{ base: '25px', sm: '110px' }}
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
            color="text_secondary"
            fontSize="xs"
            lineHeight="16px"
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
        </Flex>

        { !isLoading && (
          <IconButton
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="absolute"
            right={{ base: 1, sm: '10px' }}
            top={{ base: 1, sm: '18px' }}
            aria-label="Mark as favorite"
            title="Mark as favorite"
            variant="ghost"
            colorScheme="gray"
            w={ 9 }
            h={ 8 }
            onClick={ onFavoriteClick }
            icon={ <FavoriteIcon isFavorite={ isFavorite }/> }
          />
        ) }
      </Flex>
    </LinkBox>
  );
};

export default React.memo(FeaturedAppMobile);
