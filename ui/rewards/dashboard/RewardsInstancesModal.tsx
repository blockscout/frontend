import { Flex, Text, Box } from '@chakra-ui/react';
import React from 'react';

import type { RewardsInstance } from 'types/api/rewards';

import useIsMobile from 'lib/hooks/useIsMobile';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { DialogBody, DialogContent, DialogRoot, DialogHeader } from 'toolkit/chakra/dialog';
import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  items: Array<RewardsInstance> | undefined;
};

const RewardsInstancesModal = ({ isOpen, onClose, items }: Props) => {
  const isMobile = useIsMobile();
  const bgColor = useColorModeValue('blue.50', 'whiteAlpha.100');
  const textColor = useColorModeValue('gray.700', 'whiteAlpha.800');

  const handleOpenChange = React.useCallback(({ open }: { open: boolean }) => {
    if (!open) {
      onClose();
    }
  }, [ onClose ]);

  return (
    <DialogRoot
      open={ isOpen }
      onOpenChange={ handleOpenChange }
      size={ isMobile ? 'full' : 'md' }
    >
      <DialogContent width="400px" p={ 6 }>
        <DialogHeader fontWeight="500" textStyle="h3" mb={ 4 }>
          Choose explorer
        </DialogHeader>
        <DialogBody mb={ 0 }>
          <Flex flexDir="column" gap={ 6 }>
            <Text>
              Choose Blockscout explorer that you want to interact with and earn
              Merits
            </Text>
            <Flex flexWrap="wrap" gap={ 2 }>
              { items?.map((instance) => (
                <Link
                  external
                  noIcon
                  key={ instance.chain_id }
                  href={ instance.domain }
                  _hover={{ textDecoration: 'none' }}
                  role="group"
                >
                  <Flex
                    gap={ 2 }
                    alignItems="center"
                    p={ 2 }
                    bgColor={ bgColor }
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
                      color={ textColor }
                      _groupHover={{ color: 'inherit' }}
                      transitionProperty="color"
                      transitionDuration="normal"
                      transitionTimingFunction="ease"
                    >
                      { instance.name }
                    </Text>
                  </Flex>
                </Link>
              )) }
            </Flex>
          </Flex>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default RewardsInstancesModal;
