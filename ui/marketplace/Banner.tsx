import type { MouseEvent } from 'react';
import React from 'react';

import type { MarketplaceAppPreview } from 'types/client/marketplace';

import config from 'configs/app';
import { apps as appsMock } from 'mocks/apps/apps';

import FeaturedApp from './Banner/FeaturedApp';
import IframeBanner from './Banner/IframeBanner';

const feature = config.features.marketplace;

type BannerProps = {
  apps: Array<MarketplaceAppPreview> | undefined;
  favoriteApps: Array<string>;
  isLoading: boolean;
  onInfoClick: (id: string) => void;
  onFavoriteClick: (id: string, isFavorite: boolean, source: 'Banner') => void;
  onAppClick: (event: MouseEvent, id: string) => void;
};

const Banner = ({ apps = [], favoriteApps, isLoading, onInfoClick, onFavoriteClick, onAppClick }: BannerProps) => {
  if (!feature.isEnabled) {
    return null;
  }

  if (feature.featuredApp) {
    const app = apps.find(app => app.id === feature.featuredApp);
    const isFavorite = favoriteApps.includes(feature.featuredApp);
    if (!isLoading && !app) {
      return null;
    }
    return (
      <FeaturedApp
        app={ app || appsMock[0] }
        isFavorite={ isFavorite }
        isLoading={ isLoading }
        onInfoClick={ onInfoClick }
        onFavoriteClick={ onFavoriteClick }
        onAppClick={ onAppClick }
      />
    );
  } else if (feature.banner) {
    return <IframeBanner contentUrl={ feature.banner.contentUrl } linkUrl={ feature.banner.linkUrl }/>;
  }

  return null;
};

export default Banner;
