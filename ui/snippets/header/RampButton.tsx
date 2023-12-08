import { Button } from '@chakra-ui/react';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import React from 'react';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';

const feature = config.features.ramp;

const RampButton = () => {
  const isMobile = useIsMobile();
  const openRamp = React.useCallback(() => {
    if (!feature.isEnabled) {
      return;
    }

    new RampInstantSDK({
      hostAppName: 'Blockscout',
      hostLogoUrl: config.UI.sidebar.icon.default ? config.app.baseUrl + config.UI.sidebar.icon.default : '',
      hostApiKey: feature.hostApiKey,
      defaultAsset: feature.defaultAsset,
      variant: isMobile ? 'mobile' : 'desktop',
      // remove after demo
      url: 'https://app.demo.ramp.network',
    }).show();

    // Ramp overlay has a hardcoded z-index = 1000, some Blockscout elements such as mobile header have z-indexes above 1000
    // and there is no way to set styles for the Ramp overlay
    // Ramp always appends it's div as a last child of body, so this should be the right way to select it
    const rampOverlay = document.querySelector('body > div:last-of-type')?.shadowRoot?.children[1] as HTMLDivElement;
    if (rampOverlay) {
      rampOverlay.style.zIndex = '10000';
    }

  }, [ isMobile ]);

  if (!feature.isEnabled) {
    return null;
  }

  return <Button onClick={ openRamp }>Ramp</Button>;
};

export default RampButton;
