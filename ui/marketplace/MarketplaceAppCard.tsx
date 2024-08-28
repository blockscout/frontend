import { IconButton, Image, Link, LinkBox, Skeleton, useColorModeValue, chakra, Flex } from '@chakra-ui/react';
import type { MouseEvent } from 'react';
import React, { useCallback } from 'react';

import type { MarketplaceAppWithSecurityReport, ContractListTypes, AppRating } from 'types/client/marketplace';

import useIsMobile from 'lib/hooks/useIsMobile';
import isBrowser from 'lib/isBrowser';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

import AppSecurityReport from './AppSecurityReport';
import FavoriteIcon from './FavoriteIcon';
import MarketplaceAppCardLink from './MarketplaceAppCardLink';
import MarketplaceAppIntegrationIcon from './MarketplaceAppIntegrationIcon';
import Rating from './Rating/Rating';
import type { RateFunction } from './Rating/useRatings';

interface Props extends MarketplaceAppWithSecurityReport {
  onInfoClick: (id: string) => void;
  isFavorite: boolean;
  onFavoriteClick: (id: string, isFavorite: boolean) => void;
  isLoading: boolean;
  onAppClick: (event: MouseEvent, id: string) => void;
  className?: string;
  showContractList: (id: string, type: ContractListTypes) => void;
  userRating?: AppRating;
  rateApp: RateFunction;
  isRatingSending: boolean;
  isRatingLoading: boolean;
  canRate: boolean | undefined;
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
  securityReport,
  className,
  showContractList,
  rating,
  userRating,
  rateApp,
  isRatingSending,
  isRatingLoading,
  canRate,
}: Props) => {
  const isMobile = useIsMobile();
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
      border="1px"
      borderColor={ useColorModeValue('gray.200', 'gray.600') }
      role="group"
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
            isLoaded={ !isLoading }
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
              isLoaded={ !isLoading }
              fontSize={{ base: 'sm', md: 'lg' }}
              lineHeight={{ base: '20px', md: '28px' }}
              paddingRight={{ base: '40px', md: 0 }}
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
          </Flex>
        </Flex>

        <Skeleton
          isLoaded={ !isLoading }
          fontSize="sm"
          lineHeight="20px"
          noOfLines={{ base: 2, md: 3 }}
        >
          { shortDescription }
        </Skeleton>

        { !isLoading && (
          <Flex
            alignItems="center"
            justifyContent="space-between"
            marginTop="auto"
          >
            <Link
              fontSize="sm"
              fontWeight="500"
              paddingRight={{ md: 2 }}
              href="#"
              onClick={ handleInfoClick }
            >
              More info
            </Link>
            <Flex alignItems="center">
              <Rating
                appId={ id }
                rating={ rating }
                userRating={ userRating }
                rate={ rateApp }
                isSending={ isRatingSending }
                isLoading={ isRatingLoading }
                canRate={ canRate }
                source="Discovery"
              />
              <IconButton
                aria-label="Mark as favorite"
                title="Mark as favorite"
                variant="ghost"
                colorScheme="gray"
                w={{ base: 6, md: '30px' }}
                h={{ base: 6, md: '30px' }}
                onClick={ handleFavoriteClick }
                icon={ <FavoriteIcon isFavorite={ isFavorite }/> }
                ml={ 2 }
              />
              <CopyToClipboard
                text={ isBrowser() ? window.location.origin + `/apps/${ id }` : '' }
                icon="share"
                size={ 4 }
                variant="ghost"
                colorScheme="gray"
                w={{ base: 6, md: '30px' }}
                h={{ base: 6, md: '30px' }}
                color="gray.400"
                _hover={{ color: 'gray.400' }}
                ml={{ base: 1, md: 0 }}
                display="inline-flex"
                borderRadius="base"
              />
            </Flex>
          </Flex>
        ) }

        { securityReport && (
          <AppSecurityReport
            id={ id }
            securityReport={ securityReport }
            showContractList={ showContractList }
            isLoading={ isLoading }
            source="Discovery view"
            popoverPlacement={ isMobile ? 'bottom-end' : 'left' }
            position="absolute"
            right={{ base: 3, md: 5 }}
            top={{ base: '10px', md: 5 }}
            border={ 0 }
            padding={ 0 }
          />
        ) }
      </Flex>
    </LinkBox>
  );
};

export default React.memo(chakra(MarketplaceAppCard));
