import { Grid } from '@chakra-ui/react';
import React from 'react';
import type { MouseEvent } from 'react';

import type { MarketplaceAppPreview } from 'types/client/marketplace';

import EmptySearchResult from './EmptySearchResult';
import MarketplaceAppCard from './MarketplaceAppCard';

type Props = {
  apps: Array<MarketplaceAppPreview>;
  showAppInfo: (id: string) => void;
  favoriteApps: Array<string>;
  onFavoriteClick: (id: string, isFavorite: boolean, source: 'Discovery view') => void;
  isLoading: boolean;
  selectedCategoryId?: string;
  onAppClick: (event: MouseEvent, id: string) => void;
}

const MarketplaceList = ({ apps, showAppInfo, favoriteApps, onFavoriteClick, isLoading, selectedCategoryId, onAppClick }: Props) => {
  return apps.length > 0 ? (
    <Grid
      templateColumns={{
        sm: 'repeat(auto-fill, minmax(178px, 1fr))',
        lg: 'repeat(auto-fill, minmax(260px, 1fr))',
      }}
      autoRows="1fr"
      gap={{ base: '16px', sm: '24px' }}
    >
      { apps.map((app, index) => (
        <MarketplaceAppCard
          key={ app.id + (isLoading ? index : '') }
          onInfoClick={ showAppInfo }
          id={ app.id }
          external={ app.external }
          url={ app.url }
          title={ app.title }
          logo={ app.logo }
          logoDarkMode={ app.logoDarkMode }
          shortDescription={ app.shortDescription }
          categories={ app.categories }
          isFavorite={ favoriteApps.includes(app.id) }
          onFavoriteClick={ onFavoriteClick }
          isLoading={ isLoading }
          internalWallet={ app.internalWallet }
          onAppClick={ onAppClick }
        />
      )) }
    </Grid>
  ) : (
    <EmptySearchResult selectedCategoryId={ selectedCategoryId } favoriteApps={ favoriteApps }/>
  );
};

export default React.memo(MarketplaceList);
