import { Box } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { Image } from 'toolkit/chakra/image';
import IconSvg from 'ui/shared/IconSvg';

interface ClusterIconProps {
  clusterName: string;
  size?: number;
  borderRadius?: string;
  mr?: number;
  flexShrink?: number;
}

const ClusterIcon = ({
  clusterName,
  size = 5,
  borderRadius = '6px',
  mr = 2,
  flexShrink = 0,
}: ClusterIconProps) => {
  const fallbackElement = (
    <Box
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      width={ size }
      height={ size }
      backgroundColor="#de6061"
      borderRadius={ borderRadius }
      mr={ mr }
      flexShrink={ flexShrink }
    >
      <IconSvg
        name="clusters"
        boxSize={ 3 }
        color="white"
      />
    </Box>
  );

  if (!config.features.clusters?.isEnabled) {
    return fallbackElement;
  }

  return (
    <Image
      width={ size }
      height={ size }
      borderRadius={ borderRadius }
      mr={ mr }
      flexShrink={ flexShrink }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      src={ `${ (config.features.clusters as any).cdnUrl }/profile-image/${ clusterName }` }
      alt={ `${ clusterName } profile` }
      fallback={ fallbackElement }
    />
  );
};

export default React.memo(ClusterIcon);
