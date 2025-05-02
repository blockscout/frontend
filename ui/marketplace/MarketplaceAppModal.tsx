import { Box, Flex, Text } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { MarketplaceAppWithSecurityReport, AppRating } from 'types/client/marketplace';
import { ContractListTypes } from 'types/client/marketplace';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import * as mixpanel from 'lib/mixpanel/index';
import { Badge } from 'toolkit/chakra/badge';
import { Button } from 'toolkit/chakra/button';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogRoot } from 'toolkit/chakra/dialog';
import { Heading } from 'toolkit/chakra/heading';
import { IconButton } from 'toolkit/chakra/icon-button';
import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';
import { nbsp } from 'toolkit/utils/htmlEntities';
import { isBrowser } from 'toolkit/utils/isBrowser';
import { makePrettyLink } from 'toolkit/utils/url';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

import AppSecurityReport from './AppSecurityReport';
import FavoriteIcon from './FavoriteIcon';
import MarketplaceAppGraphLinks from './MarketplaceAppGraphLinks';
import MarketplaceAppIntegrationIcon from './MarketplaceAppIntegrationIcon';
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
  graphLinks?: Array<{ title: string; url: string }>;
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

  const handleOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    if (!open) {
      onClose();
    }
  }, [ onClose ]);

  const handleFavoriteClick = useCallback(() => {
    onFavoriteClick(id, isFavorite, 'App modal');
  }, [ onFavoriteClick, id, isFavorite ]);

  const showContractList = useCallback((id: string, type: ContractListTypes) => {
    onClose();
    // FIXME: This is a workaround to avoid the dialog closing before the modal is opened
    window.setTimeout(() => {
      showContractListProp(id, type, true);
    }, 100);
  }, [ showContractListProp, onClose ]);

  const showAllContracts = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Total contracts', Info: id, Source: 'App modal' });
    showContractList(id, ContractListTypes.ALL);
  }, [ showContractList, id ]);

  const isMobile = useIsMobile();
  const logoUrl = useColorModeValue(logo, logoDarkMode || logo);

  return (
    <DialogRoot
      open={ Boolean(data.id) }
      onOpenChange={ handleOpenChange }
      size={{ lgDown: 'full', lg: 'md' }}
    >
      <DialogContent>
        <Box
          display="grid"
          gridTemplateColumns={{ base: 'auto 1fr' }}
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
              level="2"
              fontWeight="medium"
              mr={ 2 }
            >
              { title }
            </Heading>
            <MarketplaceAppIntegrationIcon external={ external } internalWallet={ internalWallet }/>
            <MarketplaceAppGraphLinks links={ graphLinks } ml={ 2 }/>
            <DialogCloseTrigger ml="auto"/>
          </Flex>

          <Text
            color="text.secondary"
            gridColumn={ 2 }
            textStyle={{ base: 'sm', md: 'md' }}
            fontWeight="normal"
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
                popoverContentProps={{ zIndex: 'modal' }}
              />
            </Box>
          ) }

          <Box
            gridColumn={{ base: '1 / 3', md: 2 }}
            marginTop={{ base: 6, md: 3 }}
          >
            <Flex flexWrap="wrap" gap={ 6 }>
              <Flex width={{ base: '100%', md: 'auto' }}>
                <Link href={ external ? url : route({ pathname: '/apps/[id]', query: { id: data.id } }) } external={ external } noIcon mr={ 2 }>
                  <Button size="sm">
                    Launch app
                  </Button>
                </Link>

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
          </Box>
        </Box>

        <DialogBody mb={ 6 }>
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
                  popoverContentProps={{ zIndex: 'modal' }}
                />
              </Flex>
            </Flex>
          ) }
          <Text>{ description }</Text>
        </DialogBody>

        <DialogFooter
          display="flex"
          flexDirection={{ base: 'column', md: 'row' }}
          justifyContent={{ base: 'flex-start', md: 'space-between' }}
          alignItems="flex-start"
          gap={ 3 }
        >
          <Flex gap={ 2 } flexWrap="wrap">
            { categories.map((category) => (
              <Badge
                colorPalette="blue"
                key={ category }
              >
                { category }
              </Badge>
            )) }
          </Flex>

          <Flex alignItems="center" gap={ 3 } my="2px">
            { site && (
              <Link
                external
                href={ site }
                display="flex"
                alignItems="center"
                textStyle="sm"
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
                  { makePrettyLink(site)?.domain }
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
                external
                noIcon
                flexShrink={ 0 }
              >
                <IconSvg
                  name={ icon }
                  color="text.secondary"
                  boxSize={ 5 }
                />
              </Link>
            )) }
          </Flex>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};

export default MarketplaceAppModal;
