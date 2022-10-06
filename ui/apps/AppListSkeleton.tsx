import { Grid, GridItem } from '@chakra-ui/react';
import React from 'react';

import { AppCardSkeleton } from 'ui/apps/AppCardSkeleton';

const applicationStubs = [ ...Array(12) ];

const AppListSkeleton = () => {
  return (
    <Grid
      templateColumns={{
        sm: 'repeat(auto-fill, minmax(170px, 1fr))',
        lg: 'repeat(auto-fill, minmax(260px, 1fr))',
      }}
      autoRows="1fr"
      gap={{ base: '16px', sm: '24px' }}
    >
      { applicationStubs.map((app, index) => (
        <GridItem
          key={ index }
        >
          <AppCardSkeleton/>
        </GridItem>
      )) }
    </Grid>
  );
};

export default AppListSkeleton;
