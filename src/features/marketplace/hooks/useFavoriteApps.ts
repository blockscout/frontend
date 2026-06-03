// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import * as mixpanel from 'src/services/mixpanel';

const STORAGE_KEY = 'favoriteApps';

function getFavoriteApps() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Array<string>;
  } catch (e) {
    return [];
  }
}

export default function useFavoriteApps() {
  const [ favoriteApps, setFavoriteApps ] = React.useState<Array<string>>(getFavoriteApps());

  const onFavoriteClick = React.useCallback((id: string, isFavorite: boolean, source: 'Discovery view' | 'App page' | 'Banner') => {
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Favorite app', Info: id, Source: source });

    const favoriteApps = getFavoriteApps();

    if (isFavorite) {
      const result = favoriteApps.filter((appId: string) => appId !== id);
      setFavoriteApps(result);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    } else {
      favoriteApps.push(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteApps));
      setFavoriteApps(favoriteApps);
    }
  }, [ ]);

  return React.useMemo(() => ({
    favoriteApps,
    onFavoriteClick,
  }), [ favoriteApps, onFavoriteClick ]);
}
