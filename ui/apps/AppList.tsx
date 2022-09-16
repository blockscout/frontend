import { Text, Grid, GridItem, VisuallyHidden } from '@chakra-ui/react';
import AppCard from '~/ui/apps/AppCard';
import React from 'react';

import type { AppItemOverview } from '~/types/client/apps';

type Props = {
  apps: Array<AppItemOverview>;
}

const AppList = ({ apps }: Props) => {
  return (
    <>
      <VisuallyHidden>
        <Text as="h2">App list</Text>
      </VisuallyHidden>

      <Grid
        templateColumns={{
          base: 'repeat(auto-fill, minmax(140px, 1fr))',
          lg: 'repeat(auto-fill, minmax(260px, 1fr))',
        }}
        autoRows="1fr"
        gap={{ base: '1px', lg: '24px' }}
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
    </>
  );
};

export default AppList;
