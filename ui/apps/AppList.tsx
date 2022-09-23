import { Grid, GridItem, VisuallyHidden, Heading } from '@chakra-ui/react';
import React from 'react';

import type { AppItemPreview } from 'types/client/apps';

import { apos } from 'lib/html-entities';
import AppCard from 'ui/apps/AppCard';
import EmptySearchResult from 'ui/apps/EmptySearchResult';

type Props = {
  apps: Array<AppItemPreview>;
}

const AppList = ({ apps }: Props) => {
  return (
    <>
      <VisuallyHidden>
        <Heading as="h2">App list</Heading>
      </VisuallyHidden>

      { apps.length > 0 ? (
        <Grid
          templateColumns={{
            base: 'repeat(auto-fill, minmax(160px, 1fr))',
            sm: 'repeat(auto-fill, minmax(200px, 1fr))',
            lg: 'repeat(auto-fill, minmax(260px, 1fr))',
          }}
          autoRows="1fr"
          gap={{ base: '1px', sm: '24px' }}
        >
          { apps.map((app) => (
            <GridItem
              key={ app.id }
            >
              <AppCard
                id={ app.id }
                title={ app.title }
                logo={ app.logo }
                shortDescription={ app.shortDescription }
                categories={ app.categories }
              />
            </GridItem>
          )) }
        </Grid>
      ) : (
        <EmptySearchResult text={ `Couldn${ apos }t find an app that matches your filter query.` }/>
      ) }
    </>
  );
};

export default AppList;
