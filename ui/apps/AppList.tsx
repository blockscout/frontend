import { Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import type { AppItemPreview } from 'types/client/apps';

import { apos } from 'lib/html-entities';
import AppCard from 'ui/apps/AppCard';
import EmptySearchResult from 'ui/apps/EmptySearchResult';

type Props = {
  apps: Array<AppItemPreview>;
  onAppClick: (id: string) => void;
  favoriteApps: Array<string>;
  onFavoriteClick: (id: string, isFavorite: boolean) => void;
}

const AppList = ({ apps, onAppClick, favoriteApps, onFavoriteClick }: Props) => {
  return apps.length > 0 ? (
    <Grid
      templateColumns={{
        sm: 'repeat(auto-fill, minmax(178px, 1fr))',
        lg: 'repeat(auto-fill, minmax(260px, 1fr))',
      }}
      autoRows="1fr"
      gap={{ base: '16px', sm: '24px' }}
    >
      { apps.map((app) => (
        <GridItem
          key={ app.id }
        >
          <AppCard
            onInfoClick={ onAppClick }
            id={ app.id }
            external={ app.external }
            url={ app.url }
            title={ app.title }
            logo={ app.logo }
            shortDescription={ app.shortDescription }
            categories={ app.categories }
            isFavorite={ favoriteApps.includes(app.id) }
            onFavoriteClick={ onFavoriteClick }
          />
        </GridItem>
      )) }
    </Grid>
  ) : (
    <EmptySearchResult text={ `Couldn${ apos }t find an app that matches your filter query.` }/>
  );
};

export default React.memo(AppList);
