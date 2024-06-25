import { Box, IconButton, Image, Link, LinkBox, Skeleton, useColorModeValue, chakra, Flex } from '@chakra-ui/react';
import type { MouseEvent } from 'react';
import React, { useCallback } from 'react';

import type { MarketplaceAppWithSecurityReport, ContractListTypes } from 'types/client/marketplace';

import useIsMobile from 'lib/hooks/useIsMobile';
import IconSvg from 'ui/shared/IconSvg';

import AppSecurityReport from './AppSecurityReport';
import MarketplaceAppCardLink from './MarketplaceAppCardLink';
import MarketplaceAppIntegrationIcon from './MarketplaceAppIntegrationIcon';

interface Props extends MarketplaceAppWithSecurityReport {
  onInfoClick: (id: string) => void;
  isFavorite: boolean;
  onFavoriteClick: (id: string, isFavorite: boolean) => void;
  isLoading: boolean;
  onAppClick: (event: MouseEvent, id: string) => void;
  className?: string;
  showContractList: (id: string, type: ContractListTypes) => void;
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
          <Box
            display="flex"
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
            <IconButton
              aria-label="Mark as favorite"
              title="Mark as favorite"
              variant="ghost"
              colorScheme="gray"
              w={{ base: 6, md: '30px' }}
              h={{ base: 6, md: '30px' }}
              onClick={ handleFavoriteClick }
              icon={ isFavorite ?
                <IconSvg name="star_filled" w={ 5 } h={ 5 } color="yellow.400"/> :
                <IconSvg name="star_outline" w={ 5 } h={ 5 } color="gray.400"/>
              }
            />
          </Box>
        ) }

        { securityReport && (
          <AppSecurityReport
            id={ id }
            securityReport={ securityReport }
            showContractList={ showContractList }
            isLoading={ isLoading }
            source="Discovery view"
            popoverPlacement={ isMobile ? 'bottom-end' : 'bottom-start' }
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
