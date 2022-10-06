import { Grid, GridItem, Heading, VisuallyHidden } from '@chakra-ui/react';
import React from 'react';

import type { AppItemPreview } from 'types/client/apps';

import { apos } from 'lib/html-entities';
import AppCard from 'ui/apps/AppCard';
import EmptySearchResult from 'ui/apps/EmptySearchResult';

import AppModal from './AppModal';

type Props = {
  apps: Array<AppItemPreview>;
  onAppClick: (id: string) => void;
  displayedAppId: string | null;
  onModalClose: () => void;
  favoriteApps: Array<string>;
  onFavoriteClick: (id: string, isFavorite: boolean) => void;
}

const AppList = ({ apps, onAppClick, displayedAppId, onModalClose, favoriteApps, onFavoriteClick }: Props) => {
  return (
    <>
      <VisuallyHidden>
        <Heading as="h2">App list</Heading>
      </VisuallyHidden>

      { apps.length > 0 ? (
        <Grid
          templateColumns={{
            sm: 'repeat(auto-fill, minmax(170px, 1fr))',
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
      ) }

      { displayedAppId && (
        <AppModal
          id={ displayedAppId }
          onClose={ onModalClose }
          isFavorite={ favoriteApps.includes(displayedAppId) }
          onFavoriteClick={ onFavoriteClick }
        />
      ) }
    </>
  );
};

export default React.memo(AppList);
