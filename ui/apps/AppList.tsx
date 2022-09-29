import { Grid, GridItem, VisuallyHidden, Heading } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';

import type { AppItemPreview } from 'types/client/apps';

import { apos } from 'lib/html-entities';
import AppCard from 'ui/apps/AppCard';
import EmptySearchResult from 'ui/apps/EmptySearchResult';

import AppModal from './AppModal';

type Props = {
  apps: Array<AppItemPreview>;
}

function getFavoriteApps() {
  try {
    return JSON.parse(localStorage.getItem('favoriteApps') || '[]');
  } catch (e) {
    return [];
  }
}

const AppList = ({ apps }: Props) => {
  const [ displayedAppId, setDisplayedAppId ] = useState<string | null>(null);
  const [ favoriteApps, setFavoriteApps ] = useState<Array<string>>([]);

  const handleAppInfoClick = useCallback((id: string) => {
    setDisplayedAppId(id);
  }, []);

  const handleCloseModal = useCallback(() => setDisplayedAppId(null), []);

  const handleFavoriteClick = useCallback((id: string, isFavorite: boolean) => {
    const favoriteApps = getFavoriteApps();

    if (isFavorite) {
      const result = favoriteApps.filter((appId: string) => appId !== id);
      setFavoriteApps(result);
      localStorage.setItem('favoriteApps', JSON.stringify(result));
    } else {
      favoriteApps.push(id);
      localStorage.setItem('favoriteApps', JSON.stringify(favoriteApps));
      setFavoriteApps(favoriteApps);
    }
  }, [ ]);

  useEffect(() => {
    setFavoriteApps(getFavoriteApps());
  }, [ ]);

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
                onInfoClick={ handleAppInfoClick }
                id={ app.id }
                title={ app.title }
                logo={ app.logo }
                shortDescription={ app.shortDescription }
                categories={ app.categories }
                isFavorite={ favoriteApps.includes(app.id) }
                onFavoriteClick={ handleFavoriteClick }
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
          onClose={ handleCloseModal }
          isFavorite={ favoriteApps.includes(displayedAppId) }
          onFavoriteClick={ handleFavoriteClick }
        />
      ) }
    </>
  );
};

export default React.memo(AppList);
