import { Box, Text, Grid, GridItem, VisuallyHidden, Icon } from '@chakra-ui/react';
import emptyIcon from '~/icons/empty.svg';
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

      { apps.length > 0 ? (
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
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Icon
            as={ emptyIcon }
            boxSize={ 60 }
            display="block"
          />

          <Text
            as="h3"
            marginBottom={ 2 }
            fontSize={{ base: '2xl', lg: '3xl' }}
            fontWeight="semibold"
          >
            No results
          </Text>

          <Text
            fontSize={{ base: 'sm' }}
            variant="secondary"
            align="center"
          >
              Couldn&apos;t find an app that matches your filter query.
          </Text>
        </Box>
      ) }
    </>
  );
};

export default AppList;
