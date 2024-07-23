import { Tooltip } from '@chakra-ui/react';
import React from 'react';

import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  internalWallet: boolean | undefined;
  external: boolean | undefined;
}

const MarketplaceAppIntegrationIcon = ({ external, internalWallet }: Props) => {
  const [ icon, iconColor, text, boxSize ] = React.useMemo(() => {
    let icon: IconName = 'integration/partial';
    let color = 'gray.400';
    let text = 'This app opens in Blockscout without Blockscout wallet functionality. Use your external web3 wallet to connect directly to this application';
    let boxSize = 5;

    if (external) {
      icon = 'link_external';
      color = 'icon_link_external';
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
      label={ text }
      textAlign="center"
      padding={ 2 }
      openDelay={ 300 }
      maxW={{ base: 'calc(100vw - 8px)', lg: '400px' }}
    >
      <IconSvg
        name={ icon }
        boxSize={ boxSize }
        color={ iconColor }
        position="relative"
        cursor="pointer"
        verticalAlign="middle"
        mb={{ base: 0, md: 1 }}
      />
    </Tooltip>
  );
};

export default MarketplaceAppIntegrationIcon;
