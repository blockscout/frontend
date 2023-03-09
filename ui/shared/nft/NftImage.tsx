import type { ResponsiveValue } from '@chakra-ui/react';
import { AspectRatio, chakra, Icon, Image, shouldForwardProp, Skeleton, useColorModeValue } from '@chakra-ui/react';
import type { Property } from 'csstype';
import React from 'react';

import nftIcon from 'icons/nft_shield.svg';

interface Props {
  url: string | null;
  className?: string;
  fallbackPadding?: string;
  objectFit: ResponsiveValue<Property.ObjectFit>;
}

interface FallbackProps {
  className?: string;
  padding?: string;
}

const Fallback = ({ className, padding }: FallbackProps) => {
  return (
    <Icon
      className={ className }
      as={ nftIcon }
      p={ padding ?? '50px' }
      color={ useColorModeValue('blackAlpha.500', 'whiteAlpha.500') }
    />
  );
};

const NftImage = ({ url, className, fallbackPadding, objectFit }: Props) => {
  const [ isLoading, setIsLoading ] = React.useState(true);

  const handleLoad = React.useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleLoadError = React.useCallback(() => {
    setIsLoading(false);
  }, []);

  const _objectFit = objectFit || 'contain';

  return (
    <AspectRatio
      className={ className }
      ratio={ 1 / 1 }
      bgColor={ useColorModeValue('blackAlpha.50', 'whiteAlpha.50') }
      overflow="hidden"
      borderRadius="md"
      sx={{
        '&>img': {
          objectFit: _objectFit,
        },
      }}
    >
      <Image
        w="100%"
        h="100%"
        objectFit={ _objectFit }
        src={ url || undefined }
        alt="Token instance image"
        fallback={ url && isLoading ? <Skeleton/> : <Fallback className={ className } padding={ fallbackPadding }/> }
        onError={ handleLoadError }
        onLoad={ handleLoad }
        loading={ url ? 'lazy' : undefined }
      />
    </AspectRatio>
  );
};

const NftImageChakra = chakra(NftImage, {
  shouldForwardProp: (prop) => {
    const isChakraProp = !shouldForwardProp(prop);

    if (isChakraProp && prop !== 'objectFit') {
      return false;
    }

    return true;
  },
});

export default NftImageChakra;
