import { Heading, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Button, useColorModeValue } from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  appId: string;
}

const MarketplaceDisclaimerModal = ({ isOpen, onClose, appId }: Props) => {

  const isMobile = useIsMobile();

  const handleContinueClick = React.useCallback(() => {
    window.localStorage.setItem('marketplace-disclaimer-shown', 'true');
  }, [ ]);

  return (
    <Modal
      isOpen={ isOpen }
      onClose={ onClose }
      size={ isMobile ? 'full' : 'md' }
      isCentered
    >
      <ModalOverlay/>

      <ModalContent>
        <ModalHeader>
          <Heading
            as="h2"
            fontSize="2xl"
            fontWeight="medium"
            lineHeight={ 1 }
            color={ useColorModeValue('blackAlpha.800', 'whiteAlpha.800') }
          >
            Disclaimer
          </Heading>
        </ModalHeader>

        <ModalBody>
          <Text color={ useColorModeValue('gray.800', 'whiteAlpha.800') }>
            You are now accessing a third-party app. Blockscout does not own, control, maintain, or audit 3rd party apps,{ ' ' }
            and is not liable for any losses associated with these interactions. Please do so at your own risk.
            <br/><br/>
            By clicking continue, you agree that you understand the risks and have read the Disclaimer.
          </Text>
        </ModalBody>

        <ModalFooter
          display="flex"
          flexDirection="row"
          alignItems="center"
        >
          <NextLink href={{ pathname: '/apps/[id]', query: { id: appId } }} passHref legacyBehavior>
            <Button
              variant="solid"
              colorScheme="blue"
              mr={ 6 }
              py="10px"
              onClick={ handleContinueClick }
            >
              Continue to app
            </Button>
          </NextLink>
          <Button
            variant="outline"
            colorScheme="blue"
            onClick={ onClose }
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MarketplaceDisclaimerModal;
