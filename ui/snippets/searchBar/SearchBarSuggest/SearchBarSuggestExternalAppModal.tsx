import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Box,
  useColorModeValue,
  HStack,
  Image,
  VStack,
  Heading,
  Text,
  Tag,
  TagLabel,
  IconButton
} from '@chakra-ui/react';
import Stars from '../../../marketplace/Rating/Stars';
import React, { useEffect } from 'react';
import { MarketplaceAppOverview, MarketplaceAppSocialInfo } from 'types/client/marketplace';
import IconSvg from 'ui/shared/IconSvg';
import WebsiteLink from '../../../marketplace/MarketplaceAppInfo/WebsiteLink';
import SocialLink from '../../../marketplace/MarketplaceAppInfo/SocialLink';
import type { Props as SocialLinkProps } from '../../../marketplace/MarketplaceAppInfo/SocialLink';
type Props = {
  isModalOpen: boolean;
  onModalClose: () => void;
  dappDetails: MarketplaceAppOverview | null;
};
const SOCIAL_LINKS: Array<Omit<SocialLinkProps, 'href'>> = [
  { field: 'github', icon: "social/github_filled", title: 'Github' },
  { field: 'twitter', icon: "social/twitter_filled", title: 'X (ex-Twitter)' },
  { field: 'telegram', icon: "social/telegram_filled", title: 'Telegram' },
  { field: 'discord', icon: "social/discord_filled", title: 'Discord' },
];
const SearchBarSuggestExternalAppModal =({isModalOpen, onModalClose, dappDetails}:Props)=> {
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
    return (
      <Modal isOpen={isModalOpen} onClose={onModalClose} isCentered size="sm">
        <ModalOverlay />
        <ModalContent>
          {/* <ModalHeader></ModalHeader> */}
          <ModalBody>
            {dappDetails ? (
              <Box>
                {/* App Header Section */}
                <HStack spacing={4} align="start" mb={4}>
                  <Image
                    src={dappDetails.logo || "https://via.placeholder.com/50"}
                    alt={`${dappDetails.title} Logo`}
                    boxSize="100px"
                    borderRadius="md"
                  />
                  <VStack align="start" spacing={1} flex="1">                 
                  <VStack align="start" spacing={4}>
                  <VStack align="start" spacing={1} flex="1">
                  <HStack spacing={2} alignItems="center">
                  <Heading size="md">{dappDetails.title}</Heading>
                  <IconSvg
                    name="link_external"
                    color="icon_link_external"
                    boxSize={3}
                    verticalAlign="middle"
                    flexShrink={0}
                    />
                  </HStack>
                   <Text fontSize="xs" color="gray.500">
                      By {dappDetails.author}
                   </Text>
                  </VStack>
                  <HStack spacing={2}>
                  {2
                  && 
                  (<>
                  <Stars filledIndex={2 }/>
                  <Text fontSize="sm" color="gray.500">
                    {2}(5) 
                  </Text>
                  <Text fontSize="sm" color="blue.500">
                    Rate it!
                  </Text>
                  </>
                  )}
                  </HStack>
                  </VStack>
                  <HStack>
                  <Button colorScheme="blue" size="sm" mt={4}>
                   Launch App
                  </Button>
                  </HStack>
                  </VStack>
                  <ModalCloseButton />
                </HStack>                
               
                {/* Description Section */}
                <Text fontSize="sm" color="gray.700" mt={4}>
                  {dappDetails.description || "No description available."}
                </Text>

                {/* Tags Section */}
                {/* <HStack spacing={2} mt={4}>
                  {dappDetails.tags?.map((tag, index) => (
                    <Tag key={index} size="sm" variant="subtle" colorScheme="blue">
                      <TagLabel>{tag}</TagLabel>
                    </Tag>
                  ))}
                </HStack> */}
              </Box>
            ) : (
              <Text>No details available for the selected app.</Text>
            )}
          </ModalBody>
          <ModalFooter>
              <HStack spacing={2} mt={4}>
                  {dappDetails?.categories?.map((category, index) => (
                    <Tag key={index} size="sm" variant="subtle" colorScheme="blue">
                      <TagLabel>{category}</TagLabel>
                    </Tag>
                  ))}
              </HStack>
              <HStack spacing={2} mt={4}>
              (dappDetails && <WebsiteLink url={ dappDetails?.site }/>)
              (dappDetails && { socialLinks.map((link, index) => <SocialLink key={ index } { ...link }/>) })
              </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>   
    );
  
}
export default React.memo(SearchBarSuggestExternalAppModal);
