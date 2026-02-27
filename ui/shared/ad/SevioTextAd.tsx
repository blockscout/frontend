import { Box, chakra } from '@chakra-ui/react';
import React, { useEffect } from 'react';

import config from 'configs/app';

const adTextFeature = config.features.adsText;

// Sevio native ad template (configured on the Sevio platform):
// <img src="[%thumbnail%]" width="20" height="20" style="display: inline-block; vertical-align: text-bottom; margin-right: 4px;" alt="" />
// <strong>Sponsored:</strong> [%sponsored%] &#8211; [%title%] <a href="[%clickURL%]" target="_blank">[%ctatext%]</a>

const SevioTextAd = ({ className }: { className?: string }) => {
  useEffect(() => {
    if (!adTextFeature.isEnabled) {
      return;
    }
    const { zone, adType, inventoryId, accountId } = adTextFeature.sevio;
    window.sevioads = window.sevioads || [];
    window.sevioads.push([ { zone, adType, inventoryId, accountId } ]);
  }, []);

  if (!adTextFeature.isEnabled) {
    return null;
  }

  const { zone } = adTextFeature.sevio;

  return (
    <Box
      className={ className }
      textStyle={{ base: 'xs', lg: 'md' }}
      color={{ base: 'text.secondary', lg: 'text.primary' }}
      css={{
        '& .sevioads *': {
          fontFamily: 'inherit',
          fontSize: 'inherit',
        },
        '& .sevioads strong': {
          color: 'inherit',
        },
        '& .sevioads a': {
          color: 'link.primary',
          _hover: {
            color: 'link.primary.hover',
          },
        },
      }}
    >
      <div className="sevioads" data-zone={ zone }/>
    </Box>
  );
};

export default chakra(SevioTextAd);
