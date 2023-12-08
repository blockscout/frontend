import { Button } from '@chakra-ui/react';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import React from 'react';

import config from 'configs/app';

const feature = config.features.ramp;

const RampButton = () => {
  const openRamp = React.useCallback(() => {
    if (!feature.isEnabled) {
      return;
    }

    new RampInstantSDK({
      hostAppName: 'Blockscout',
      hostLogoUrl: config.UI.sidebar.icon.default ? config.app.baseUrl + config.UI.sidebar.icon.default : '',
      hostApiKey: feature.hostApiKey,
      defaultAsset: feature.defaultAsset,
      // remove after demo
      url: 'https://app.demo.ramp.network',
    }).show();
  }, []);

  if (!feature.isEnabled) {
    return null;
  }

  return <Button onClick={ openRamp }>Ramp</Button>;
};

export default RampButton;
