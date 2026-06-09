// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { IconName } from 'src/sprite/SpriteIcon';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Tooltip } from 'src/toolkit/chakra/tooltip';

type Props = {
  internalWallet: boolean | undefined;
  external: boolean | undefined;
  isLoading?: boolean;
};

const MarketplaceAppIntegrationIcon = ({ external, internalWallet, isLoading }: Props) => {
  const [ icon, iconColor, text, boxSize ] = React.useMemo(() => {
    let icon: IconName = 'integration/partial';
    let color = 'icon.secondary';
    let text = 'This app opens in Blockscout without Blockscout wallet functionality. Use your external web3 wallet to connect directly to this application';
    let boxSize = 5;

    if (external) {
      icon = 'link_external';
      color = 'icon.secondary';
      text = 'This app opens in a separate tab';
      boxSize = 4;
    } else if (internalWallet) {
      icon = 'integration/full';
      color = 'green.500';
      text = 'This app opens in Blockscout and your Blockscout wallet connects automatically';
    }

    return [ icon, color, text, boxSize ];
  }, [ external, internalWallet ]);

  return (
    <Tooltip
      content={ text }
      openDelay={ 300 }
      contentProps={{ maxW: { base: 'calc(100vw - 8px)', lg: '400px' } }}
    >
      <SpriteIcon
        name={ icon }
        boxSize={ boxSize }
        color={ iconColor }
        position="relative"
        cursor="pointer"
        verticalAlign="middle"
        isLoading={ isLoading }
      />
    </Tooltip>
  );
};

export default MarketplaceAppIntegrationIcon;
