import {
  Flex,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Image,
  Box,
} from '@chakra-ui/react';

import type { RewardsInstance } from 'types/api/rewards';

import useIsMobile from 'lib/hooks/useIsMobile';
import getDefaultTransitionProps from 'theme/utils/getDefaultTransitionProps';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  items: Array<RewardsInstance> | undefined;
};

const RewardsInstancesModal = ({ isOpen, onClose, items }: Props) => {
  const isMobile = useIsMobile();

  return (
    <Modal
      isOpen={ isOpen }
      onClose={ onClose }
      size={ isMobile ? 'full' : 'md' }
      isCentered
      autoFocus={ false }
    >
      <ModalOverlay/>
      <ModalContent width="400px" p={ 6 }>
        <ModalHeader fontWeight="500" textStyle="h3" mb={ 4 } pr={ 12 }>
          Choose explorer
        </ModalHeader>
        <ModalCloseButton top={ 6 } right={ 6 }/>
        <ModalBody mb={ 0 }>
          <Flex flexDir="column" gap={ 6 }>
            <Text>
              Choose Blockscout explorer that you want to interact with and earn
              Merits
            </Text>
            <Flex flexWrap="wrap" gap={ 2 }>
              { items?.map((instance) => (
                <Link
                  key={ instance.chain_id }
                  href={ instance.domain }
                  isExternal
                  _hover={{ textDecoration: 'none' }}
                  role="group"
                >
                  <Flex
                    gap={ 2 }
                    alignItems="center"
                    p={ 2 }
                    bgColor="blue.50"
                    borderRadius="base"
                  >
                    <Image
                      src={ instance.details.icon_url }
                      alt={ instance.name }
                      boxSize={ 5 }
                      flexShrink={ 0 }
                      fallback={ (
                        <Box
                          boxSize={ 5 }
                          borderRadius="full"
                          bg="gray.200"
                          flexShrink={ 0 }
                        />
                      ) }
                    />
                    <Text
                      fontSize="sm"
                      fontWeight="500"
                      color="gray.700"
                      _groupHover={{ color: 'link_hovered' }}
                      { ...getDefaultTransitionProps() }
                    >
                      { instance.name }
                    </Text>
                  </Flex>
                </Link>
              )) }
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default RewardsInstancesModal;
