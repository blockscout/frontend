import { Grid } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import type { MouseEvent } from 'react';

import type { MarketplaceAppPreview } from 'types/client/marketplace';

import * as mixpanel from 'lib/mixpanel/index';

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
  const handleInfoClick = useCallback((id: string) => {
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'More button', Info: id, Source: 'Discovery view' });
    showAppInfo(id);
  }, [ showAppInfo ]);

  const handleFavoriteClick = useCallback((id: string, isFavorite: boolean) => {
    onFavoriteClick(id, isFavorite, 'Discovery view');
  }, [ onFavoriteClick ]);

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
          onInfoClick={ handleInfoClick }
          id={ app.id }
          external={ app.external }
          url={ app.url }
          title={ app.title }
          logo={ app.logo }
          logoDarkMode={ app.logoDarkMode }
          shortDescription={ app.shortDescription }
          categories={ app.categories }
          isFavorite={ favoriteApps.includes(app.id) }
          onFavoriteClick={ handleFavoriteClick }
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
