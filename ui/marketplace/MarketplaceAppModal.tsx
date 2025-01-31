import {
  Box, Flex, Heading, IconButton, Image, Link, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalOverlay, Tag, Text, useColorModeValue,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { MarketplaceAppWithSecurityReport, AppRating } from 'types/client/marketplace';
import { ContractListTypes } from 'types/client/marketplace';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import { nbsp } from 'lib/html-entities';
import isBrowser from 'lib/isBrowser';
import * as mixpanel from 'lib/mixpanel/index';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

import AppSecurityReport from './AppSecurityReport';
import FavoriteIcon from './FavoriteIcon';
import MarketplaceAppGraphLinks from './MarketplaceAppGraphLinks';
import MarketplaceAppIntegrationIcon from './MarketplaceAppIntegrationIcon';
import MarketplaceAppModalLink from './MarketplaceAppModalLink';
import Rating from './Rating/Rating';
import type { RateFunction } from './Rating/useRatings';

const feature = config.features.marketplace;
const isRatingEnabled = feature.isEnabled && feature.rating;

type Props = {
  onClose: () => void;
  isFavorite: boolean;
  onFavoriteClick: (id: string, isFavorite: boolean, source: 'App modal') => void;
  data: MarketplaceAppWithSecurityReport;
  showContractList: (id: string, type: ContractListTypes, hasPreviousStep: boolean) => void;
  userRating?: AppRating;
  rateApp: RateFunction;
  isRatingSending: boolean;
  isRatingLoading: boolean;
  canRate: boolean | undefined;
  graphLinks?: Array<{ text: string; url: string }>;
};

const MarketplaceAppModal = ({
  onClose,
  isFavorite,
  onFavoriteClick,
  data,
  showContractList: showContractListProp,
  userRating,
  rateApp,
  isRatingSending,
  isRatingLoading,
  canRate,
  graphLinks,
}: Props) => {
  const {
    id,
    title,
    url,
    external,
    author,
    description,
    site,
    github,
    telegram,
    twitter,
    discord,
    logo,
    logoDarkMode,
    categories,
    securityReport,
    rating,
    internalWallet,
  } = data;

  const socialLinks = [
    telegram ? {
      icon: 'social/telegram_filled' as IconName,
      url: telegram,
    } : null,
    twitter ? {
      icon: 'social/twitter_filled' as IconName,
      url: twitter,
    } : null,
    discord ? {
      icon: 'social/discord_filled' as IconName,
      url: discord,
    } : null,
  ].filter(Boolean);

  if (github) {
    if (Array.isArray(github)) {
      github.forEach((url) => socialLinks.push({ icon: 'social/github_filled', url }));
    } else {
      socialLinks.push({ icon: 'social/github_filled', url: github });
    }
  }

  const handleFavoriteClick = useCallback(() => {
    onFavoriteClick(id, isFavorite, 'App modal');
  }, [ onFavoriteClick, id, isFavorite ]);

  const showContractList = useCallback((id: string, type: ContractListTypes) => {
    onClose();
    showContractListProp(id, type, true);
  }, [ onClose, showContractListProp ]);

  const showAllContracts = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Total contracts', Info: id, Source: 'App modal' });
    showContractList(id, ContractListTypes.ALL);
  }, [ showContractList, id ]);

  const isMobile = useIsMobile();
  const logoUrl = useColorModeValue(logo, logoDarkMode || logo);

  function getHostname(url: string | undefined) {
    try {
      return new URL(url || '').hostname;
    } catch (err) {}
  }

  const iconColor = useColorModeValue('blue.600', 'gray.400');

  return (
    <Modal
      isOpen={ Boolean(data.id) }
      onClose={ onClose }
      size={ isMobile ? 'full' : 'md' }
      isCentered
    >
      <ModalOverlay/>

      <ModalContent>
        <Box
          display="grid"
          gridTemplateColumns={{ base: 'auto 1fr' }}
          paddingRight={{ md: 12 }}
          marginBottom={{ base: 6, md: 8 }}
        >
          <Flex
            alignItems="center"
            justifyContent="center"
            w={{ base: '72px', md: '144px' }}
            h={{ base: '72px', md: '144px' }}
            marginRight={{ base: 6, md: 8 }}
            gridRow={{ base: '1 / 3', md: '1 / 5' }}
          >
            <Image
              src={ logoUrl }
              alt={ `${ title } app icon` }
              borderRadius="md"
            />
          </Flex>

          <Flex alignItems="center" mb={{ md: 2 }} gridColumn={ 2 }>
            <Heading
              as="h2"
              fontSize={{ base: '2xl', md: '32px' }}
              fontWeight="medium"
              lineHeight={{ md: 10 }}
              mr={ 2 }
            >
              { title }
            </Heading>
            <MarketplaceAppIntegrationIcon external={ external } internalWallet={ internalWallet }/>
            <MarketplaceAppGraphLinks links={ graphLinks } ml={ 2 }/>
          </Flex>

          <Text
            variant="secondary"
            gridColumn={ 2 }
            fontSize={{ base: 'sm', md: 'md' }}
            fontWeight="normal"
            lineHeight={{ md: 6 }}
          >
            By{ nbsp }{ author }
          </Text>

          { isRatingEnabled && (
            <Box
              gridColumn={{ base: '1 / 3', md: 2 }}
              marginTop={{ base: 6, md: 3 }}
              py={{ base: 0, md: 1.5 }}
              width="fit-content"
            >
              <Rating
                appId={ id }
                rating={ rating }
                userRating={ userRating }
                rate={ rateApp }
                isSending={ isRatingSending }
                isLoading={ isRatingLoading }
                fullView
                canRate={ canRate }
                source="App modal"
              />
            </Box>
          ) }

          <Box
            gridColumn={{ base: '1 / 3', md: 2 }}
            marginTop={{ base: 6, md: 3 }}
          >
            <Flex flexWrap="wrap" gap={ 6 }>
              <Flex width={{ base: '100%', md: 'auto' }}>
                <MarketplaceAppModalLink
                  id={ data.id }
                  url={ url }
                  external={ external }
                  title={ title }
                />

                <IconButton
                  aria-label="Mark as favorite"
                  title="Mark as favorite"
                  variant="outline"
                  colorScheme="gray"
                  w={ 9 }
                  h={ 8 }
                  flexShrink={ 0 }
                  onClick={ handleFavoriteClick }
                  icon={ <FavoriteIcon isFavorite={ isFavorite } color={ iconColor }/> }
                />

                <CopyToClipboard
                  text={ isBrowser() ? window.location.origin + `/apps/${ id }` : '' }
                  icon="share"
                  size={ 4 }
                  variant="outline"
                  colorScheme="gray"
                  w={ 9 }
                  h={ 8 }
                  color={ iconColor }
                  _hover={{ color: iconColor }}
                  display="inline-flex"
                  borderRadius="base"
                />
              </Flex>
            </Flex>
          </Box>
        </Box>

        <ModalCloseButton/>

        <ModalBody mb={ 6 }>
          { securityReport && (
            <Flex
              direction={{ base: 'column', md: 'row' }}
              justifyContent={{ base: 'flex-start', md: 'space-between' }}
              gap={ 3 }
              fontSize="sm"
              mb={ 6 }
            >
              <Flex alignItems="center" gap={ 2 } flexWrap="wrap">
                <IconSvg name="contracts/verified_many" boxSize={ 5 } color="green.500"/>
                <Text>Verified contracts</Text>
                <Text fontWeight="500">
                  { securityReport?.overallInfo.verifiedNumber ?? 0 } of { securityReport?.overallInfo.totalContractsNumber ?? 0 }
                </Text>
                <Link onClick={ showAllContracts } ml={ 1 }>
                  View all contracts
                </Link>
              </Flex>
              <Flex alignItems="center" gap={ 2 }>
                <Text>Security level</Text>
                <AppSecurityReport
                  id={ id }
                  securityReport={ securityReport }
                  showContractList={ showContractList }
                  source="App modal"
                  popoverPlacement={ isMobile ? 'bottom-start' : 'left' }
                />
              </Flex>
            </Flex>
          ) }
          <Text>{ description }</Text>
        </ModalBody>

        <ModalFooter
          display="flex"
          flexDirection={{ base: 'column', md: 'row' }}
          justifyContent={{ base: 'flex-start', md: 'space-between' }}
          alignItems={{ base: 'flex-start', md: 'center' }}
          gap={ 3 }
        >
          <Flex gap={ 2 }>
            { categories.map((category) => (
              <Tag
                colorScheme="blue"
                key={ category }
              >
                { category }
              </Tag>
            )) }
          </Flex>

          <Flex alignItems="center" gap={ 3 }>
            { site && (
              <Link
                isExternal
                href={ site }
                display="flex"
                alignItems="center"
                fontSize="sm"
              >
                <IconSvg
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
                  { getHostname(site) }
                </Text>
              </Link>
            ) }

            { socialLinks.map(({ icon, url }) => (
              <Link
                aria-label={ `Link to ${ url }` }
                title={ url }
                key={ url }
                href={ url }
                display="flex"
                alignItems="center"
                justifyContent="center"
                isExternal
                w={ 5 }
                h={ 5 }
              >
                <IconSvg
                  name={ icon }
                  w="20px"
                  h="20px"
                  display="block"
                  color="text_secondary"
                />
              </Link>
            )) }
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MarketplaceAppModal;
