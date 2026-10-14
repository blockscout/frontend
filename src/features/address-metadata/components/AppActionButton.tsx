// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text, chakra } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import type { AppActionSource } from 'src/features/address-metadata/utils/build-app-action-url';
import { buildAppActionUrl } from 'src/features/address-metadata/utils/build-app-action-url';
import type { AppActionData } from 'src/features/address-metadata/utils/get-app-action-data';
import { useMultichainContext } from 'src/features/multichain/context';

import config from 'src/config';
import * as analytics from 'src/shared/analytics';

import { Image } from 'src/toolkit/chakra/image';
import { Link } from 'src/toolkit/chakra/link';

type Props = {
  data: AppActionData;
  className?: string;
  addressHash?: string;
  txHash?: string;
  source: AppActionSource;
};

const AppActionButton = ({ data, className, addressHash, txHash, source }: Props) => {
  const { appID, textColor, bgColor, appActionButtonText, appLogoURL, appMarketplaceURL } = data;

  const multichainContext = useMultichainContext();
  const chainId = multichainContext?.chain?.app_config.chain.id || config.chain.id;

  const actionURL = appMarketplaceURL ?
    buildAppActionUrl(appMarketplaceURL, { address: addressHash, chainId, txHash }, source) :
    undefined;

  const handleClick = React.useCallback(() => {
    const info = appID || actionURL;
    if (info) {
      analytics.logEvent(analytics.EventTypes.PAGE_WIDGET, { Type: 'Action button', Info: info, Source: source });
    }
  }, [ source, appID, actionURL ]);

  if ((!appID && !actionURL) || (!appActionButtonText && !appLogoURL)) {
    return null;
  }

  const content = (
    <>
      { appLogoURL && (
        <Image
          src={ appLogoURL }
          alt={ `${ appActionButtonText } button` }
          boxSize={ 5 }
          borderRadius="sm"
          mr={ 2 }
        />
      ) }
      <Text textStyle="sm" fontWeight="500" color="currentColor">
        { appActionButtonText }
      </Text>
    </>
  );

  return (
    <Link
      className={ className }
      href={ actionURL ?? (appID ? route({ pathname: '/apps/[id]', query: { id: appID, action: 'connect' } }) : undefined) }
      external={ Boolean(actionURL) }
      onClick={ handleClick }
      variant="underlaid"
      iconColor={ textColor }
      color={ textColor }
      bg={ bgColor }
      _hover={{ color: textColor, opacity: textColor || bgColor ? 0.9 : 1 }}
      _active={{ color: textColor, opacity: textColor || bgColor ? 0.9 : 1 }}
    >
      { content }
    </Link>
  );
};

export default chakra(AppActionButton);
