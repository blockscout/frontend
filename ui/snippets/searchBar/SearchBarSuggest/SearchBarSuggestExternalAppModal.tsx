import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  HStack,
  Image,
  VStack,
  Heading,
  Text,
  Tag,
  TagLabel,
  Flex,
  Link,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { MarketplaceAppOverview } from 'types/client/marketplace';

import useIsMobile from 'lib/hooks/useIsMobile';
import IconSvg from 'ui/shared/IconSvg';

import useToast from '../../../../lib/hooks/useToast';
import SocialLink from '../../../marketplace/MarketplaceAppInfo/SocialLink';
import type { Props as SocialLinkProps } from '../../../marketplace/MarketplaceAppInfo/SocialLink';
import WebsiteLink from '../../../marketplace/MarketplaceAppInfo/WebsiteLink';
import Stars from '../../../marketplace/Rating/Stars';
type Props = {
  isModalOpen: boolean;
  onModalClose: () => void;
  dappDetails: MarketplaceAppOverview | null;
};
const SOCIAL_LINKS: Array<Omit<SocialLinkProps, 'href'>> = [
  { field: 'github', icon: 'social/github_filled', title: 'Github' },
  { field: 'twitter', icon: 'social/twitter_filled', title: 'X (ex-Twitter)' },
  { field: 'telegram', icon: 'social/telegram_filled', title: 'Telegram' },
  { field: 'discord', icon: 'social/discord_filled', title: 'Discord' },
];
const SearchBarSuggestExternalAppModal = ({ isModalOpen, onModalClose, dappDetails }: Props) => {
  const isMobile = Boolean(useIsMobile());
  const toast = useToast();
  const socialLinks: Array<SocialLinkProps> = [];
  SOCIAL_LINKS.forEach((link) => {
    const href = dappDetails?.[link.field];
    if (href) {
      if (Array.isArray(href)) {
        href.forEach((href) => socialLinks.push({ ...link, href }));
      } else {
        socialLinks.push({ ...link, href });
      }
    }
  });
  const handleCopy = useCallback(() => {
    const urlToCopy = dappDetails?.site;

    navigator.clipboard
      .writeText(urlToCopy || '')
      .then(() => {
        toast({
          status: 'success',
          title: 'Copied to clipboard!',
        });
      })
      .catch(() => {
        toast({
          status: 'error',
          title: 'URL Copy failed',
        });
      });
  }, [ dappDetails?.site, toast ]);

  const launchApp = useCallback(() => {
    const appUrl = dappDetails?.site;
    window.open(appUrl, '_blank');
  }, [ dappDetails?.site ]);

  return (
    <Modal isOpen={ isModalOpen } onClose={ onModalClose } isCentered size="md">
      <ModalOverlay/>
      <ModalContent>
        <ModalBody>
          { dappDetails ? (
            <Box>
              <HStack spacing={ 4 } align="start" mb={ 4 }>
                <Image
                  src={ dappDetails.logo || "" }
                  alt={ `${ dappDetails.title } Logo` }
                  boxSize="100px"
                  borderRadius="md"
                />
                <VStack align="start" spacing={ 1 } flex="1">
                  <VStack align="start" spacing={ 4 }>
                    <VStack align="start" spacing={ 1 } flex="1">
                      <HStack spacing={ 2 } alignItems="center">
                        <Heading size="md">{ dappDetails.title }</Heading>
                        <Link href={ dappDetails?.site } target="_blank">
                          <IconSvg
                            name="link_external"
                            color="icon_link_external"
                            boxSize={ 3 }
                            verticalAlign="middle"
                            flexShrink={ 0 }
                          />
                        </Link>
                      </HStack>
                      <Text fontSize="xs" color="gray.500">
                        By { dappDetails.author }
                      </Text>
                    </VStack>
                    <HStack spacing={ 2 }>
                      <Stars filledIndex={ dappDetails?.rating ? dappDetails.rating - 1 : -1 }/>
                      <Text fontSize="sm" color="gray.500">
                        { dappDetails?.rating ? dappDetails?.rating : 0 }
                        { /* (5)  */ }
                      </Text>
                      { /* <Text fontSize="sm" color="blue.500">
                    Rate it!
                  </Text> */ }
                    </HStack>
                  </VStack>
                  <HStack>
                    <Button colorScheme="blue" size="sm" mt={ 4 } onClick={ launchApp } borderColor="gray.300">
                      Launch App
                    </Button>
                    { /* <Button colorScheme="white" variant="outline" size="sm" mt={4}>
                  <IconSvg
                    name="heart_outline"
                    color="blue.500"
                    boxSize={3}
                    verticalAlign="middle"
                    flexShrink={0}
                    _dark={{ color: 'blue.400' }}
                    />
                  </Button> */ }
                    <Button colorScheme="white" variant="outline" size="sm" mt={ 4 } onClick={ handleCopy } borderColor="gray.300">
                      <IconSvg
                        name="share"
                        color="blue.500"
                        boxSize={ 3 }
                        verticalAlign="middle"
                        flexShrink={ 0 }
                        _dark={{ color: 'blue.400' }}
                      />
                    </Button>

                  </HStack>
                </VStack>
                <ModalCloseButton/>
              </HStack>

              <Text fontSize="sm" color="gray.700" mt={ 4 }>
                { dappDetails.description || 'No description available.' }
              </Text>
            </Box>
          ) : (
            <Text>No details available for the selected app.</Text>
          ) }
        </ModalBody>
        <ModalFooter>
          { !isMobile && (
            <Flex justify="space-between" align="center" w="100%">
              <HStack spacing={ 2 } mt={ 3 }>
                { dappDetails?.categories?.map((category, index) => (
                  <Tag key={ index } size="sm" variant="subtle" colorScheme="blue">
                    <TagLabel>{ category }</TagLabel>
                  </Tag>
                )) }
              </HStack>
              <HStack spacing={ 4 }>
                { dappDetails?.site && <WebsiteLink url={ dappDetails.site }/> }
                { dappDetails && socialLinks?.map((link, index) => (
                  <SocialLink showIconsOnly={ true } key={ index } { ...link }/>
                )) }
              </HStack>
            </Flex>
          ) }
          { isMobile && (
            <Flex direction="column" align="flex-start" w="100%" mt={ 3 }>
              <HStack spacing={ 2 } mt={ 3 }>
                { dappDetails?.categories?.map((category, index) => (
                  <Tag key={ index } size="sm" variant="subtle" colorScheme="blue">
                    <TagLabel>{ category }</TagLabel>
                  </Tag>
                )) }
              </HStack>
              <HStack spacing={ 4 }>
                { dappDetails?.site && <WebsiteLink url={ dappDetails.site }/> }
                { dappDetails && socialLinks?.map((link, index) => (
                  <SocialLink showIconsOnly={ true } key={ index } { ...link }/>
                )) }
              </HStack>
            </Flex>
          ) }
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

};
export default React.memo(SearchBarSuggestExternalAppModal);
