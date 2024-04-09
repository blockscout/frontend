import { Alert } from '@chakra-ui/react';
import React from 'react';

import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  internalWallet: boolean | undefined;
  isWalletConnected: boolean;
}

const MarketplaceAppAlert = ({ internalWallet, isWalletConnected }: Props) => {
  const message = React.useMemo(() => {
    let icon: IconName = 'wallet';
    let text = 'Connect your wallet to Blockscout for full-featured access';
    let status: 'warning' | 'success' = 'warning';

    if (isWalletConnected && internalWallet) {
      icon = 'integration/full';
      text = 'Your wallet is connected with Blockscout';
      status = 'success';
    } else if (!internalWallet) {
      icon = 'integration/partial';
      text = 'Connect your wallet in the app below';
    }

    return { icon, text, status };
  }, [ isWalletConnected, internalWallet ]);

  return (
    <Alert
      status={ message.status }
      borderRadius="base"
      px={ 3 }
      py={{ base: 3, md: 1.5 }}
      fontSize="sm"
      lineHeight={ 5 }
    >
      <IconSvg
        name={ message.icon }
        color={ message.status === 'success' ? 'green.600' : 'current' }
        boxSize={ 5 }
        flexShrink={ 0 }
        mr={ 2 }
      />
      { message.text }
    </Alert>
  );
};

export default MarketplaceAppAlert;
