import React from 'react';

import abiIcon from 'icons/ABI.svg';
import apiKeysIcon from 'icons/API.svg';
import appsIcon from 'icons/apps.svg';
import blocksIcon from 'icons/block.svg';
import gearIcon from 'icons/gear.svg';
import privateTagIcon from 'icons/privattags.svg';
import profileIcon from 'icons/profile.svg';
import publicTagIcon from 'icons/publictags.svg';
import tokensIcon from 'icons/token.svg';
import transactionsIcon from 'icons/transactions.svg';
import watchlistIcon from 'icons/watchlist.svg';
import useBasePath from 'lib/hooks/useBasePath';

export default function useNavItems() {
  const basePath = useBasePath();

  return React.useMemo(() => {
    const mainNavItems = [
      { text: 'Blocks', pathname: basePath + '/blocks', icon: blocksIcon },
      { text: 'Transactions', pathname: basePath + '/transactions', icon: transactionsIcon },
      { text: 'Tokens', pathname: basePath + '/tokens', icon: tokensIcon },
      { text: 'Apps', pathname: basePath + '/apps', icon: appsIcon },
      { text: 'Other', pathname: basePath + '/other', icon: gearIcon },
    ];

    const accountNavItems = [
      { text: 'Watchlist', pathname: basePath + '/account/watchlist', icon: watchlistIcon },
      { text: 'Private tags', pathname: basePath + '/account/private_tags', icon: privateTagIcon },
      { text: 'Public tags', pathname: basePath + '/account/public_tags_request', icon: publicTagIcon },
      { text: 'API keys', pathname: basePath + '/account/api_key', icon: apiKeysIcon },
      { text: 'Custom ABI', pathname: basePath + '/account/custom_abi', icon: abiIcon },
    ];

    const profileItem = { text: 'My profile', pathname: basePath + '/auth/profile', icon: profileIcon };

    return { mainNavItems, accountNavItems, profileItem };
  }, [ basePath ]);
}
