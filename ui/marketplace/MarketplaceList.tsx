import { Grid } from '@chakra-ui/react';
import React from 'react';

import type { MarketplaceAppPreview } from 'types/client/marketplace';
import { MarketplaceCategory } from 'types/client/marketplace';

import { apos } from 'lib/html-entities';
import EmptySearchResult from 'ui/shared/EmptySearchResult';
import IconSvg from 'ui/shared/IconSvg';

import MarketplaceAppCard from './MarketplaceAppCard';

type Props = {
  apps: Array<MarketplaceAppPreview>;
  onAppClick: (id: string) => void;
  favoriteApps: Array<string>;
  onFavoriteClick: (id: string, isFavorite: boolean) => void;
  isLoading: boolean;
  showDisclaimer: (id: string) => void;
  selectedCategoryId?: string;
}

const MarketplaceList = ({ apps, onAppClick, favoriteApps, onFavoriteClick, isLoading, showDisclaimer, selectedCategoryId }: Props) => {
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
          onInfoClick={ onAppClick }
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
          showDisclaimer={ showDisclaimer }
          internalWallet={ app.internalWallet }
        />
      )) }
    </Grid>
  ) : (
    <EmptySearchResult
      text={
        (selectedCategoryId === MarketplaceCategory.FAVORITES && !favoriteApps.length) ? (
          <>
            You don{ apos }t have any favorite apps.
            Click on the <IconSvg name="star_outline" w={ 4 } h={ 4 } mb={ -0.5 }/> icon on the app{ apos }s card to add it to Favorites.
          </>
        ) : (
          `Couldn${ apos }t find an app that matches your filter query.`
        )
      }
    />
  );
};

export default React.memo(MarketplaceList);
