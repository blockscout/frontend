import {
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';

import type { TokenInstance } from 'types/api/token';

import NftHtml from './NftHtml';
import NftImage from './NftImage';
import NftVideo from './NftVideo';
import useNftMediaInfo from './useNftMediaInfo';
import type { MediaType } from './utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: TokenInstance;
  allowedTypes?: Array<MediaType>;
  field: 'animation_url' | 'image_url';
}

const NftMediaFullscreenModal = ({ isOpen, onClose, data, allowedTypes, field }: Props) => {
  const [ mediaInfoIndex, setMediaInfoIndex ] = React.useState(0);

  const mediaInfoQuery = useNftMediaInfo({ data, size: 'original', allowedTypes, field, isEnabled: true });

  const handleMediaLoadError = React.useCallback(() => {
    if (mediaInfoQuery.data) {
      if (mediaInfoIndex < mediaInfoQuery.data.length - 1) {
        setMediaInfoIndex(mediaInfoIndex + 1);
        return;
      }
    }
    // FIXME: maybe we should display something if the media is not loaded
  }, [ mediaInfoIndex, mediaInfoQuery.data ]);

  const content = (() => {
    const mediaInfo = mediaInfoQuery.data?.[mediaInfoIndex];

    switch (mediaInfo?.mediaType) {
      case 'video':
        return (
          <NftVideo
            src={ mediaInfo.src }
            transport={ mediaInfo.transport }
            onError={ handleMediaLoadError }
            maxW="90vw"
            maxH="90vh"
            objectFit="contain"
            autoPlay
            instance={ data }
          />
        );
      case 'html':
        return (
          <NftHtml
            src={ mediaInfo.src }
            transport={ mediaInfo.transport }
            onError={ handleMediaLoadError }
            w="90vw"
            h="90vh"
          />
        );
      case 'image':
        return (
          <NftImage
            src={ mediaInfo.src }
            srcSet={ mediaInfo.srcSet }
            transport={ mediaInfo.transport }
            onError={ handleMediaLoadError }
            maxW="90vw"
            maxH="90vh"
            objectFit="contain"/>
        );
      default:
        return null;
    }
  })();

  return (
    <Modal isOpen={ isOpen } onClose={ onClose } motionPreset="none">
      <ModalOverlay/>
      <ModalContent w="unset" maxW="100vw" p={ 0 } background="none" boxShadow="none">
        <ModalCloseButton position="fixed" top={{ base: 2.5, lg: 8 }} right={{ base: 2.5, lg: 8 }} color="whiteAlpha.800"/>
        { content }
      </ModalContent>
    </Modal>
  );
};

export default NftMediaFullscreenModal;
