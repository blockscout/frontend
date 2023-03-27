import type { ResponsiveValue } from '@chakra-ui/react';
import { Box, AspectRatio, chakra, Icon, Image, shouldForwardProp, Skeleton, useColorModeValue } from '@chakra-ui/react';
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
  const [ isError, setIsError ] = React.useState(false);

  const handleLoad = React.useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleLoadError = React.useCallback(() => {
    setIsLoading(false);
    setIsError(true);
  }, []);

  const _objectFit = objectFit || 'contain';

  const content = (() => {
    // as of ChakraUI v2.5.3
    // fallback prop of Image component doesn't work well with loading prop lazy strategy
    // so we have to render fallback and loader manually
    if (isError || !url) {
      return <Fallback className={ className } padding={ fallbackPadding }/>;
    }

    return (
      <Box>
        { isLoading && <Skeleton position="absolute" left={ 0 } top={ 0 } w="100%" h="100%" zIndex="1"/> }
        <Image
          w="100%"
          h="100%"
          objectFit={ _objectFit }
          src={ url }
          opacity={ isLoading ? 0 : 1 }
          alt="Token instance image"
          onError={ handleLoadError }
          onLoad={ handleLoad }
          loading={ url ? 'lazy' : undefined }
        />
      </Box>
    );
  })();

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
      { content }
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
