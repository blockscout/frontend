import { AspectRatio, chakra, Icon, Image, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import nftIcon from 'icons/nft_shield.svg';

interface Props {
  url: string | null;
  className?: string;
  fallbackPadding?: string;
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

const NftImage = ({ url, className, fallbackPadding }: Props) => {
  return (
    <AspectRatio
      className={ className }
      ratio={ 1 / 1 }
      bgColor={ useColorModeValue('blackAlpha.50', 'whiteAlpha.50') }
      overflow="hidden"
      borderRadius="md"
      sx={{
        '&>img': {
          objectFit: 'contain',
        },
      }}
    >
      <Image
        w="100%"
        h="100%"
        objectFit="contain"
        src={ url || undefined }
        alt="Token instance image"
        fallback={ <Fallback className={ className } padding={ fallbackPadding }/> }
      />
    </AspectRatio>
  );
};

export default chakra(NftImage);
