import { Grid, GridItem, Heading, List, ListItem } from '@chakra-ui/react';
import React from 'react';

import ChartWidget from './ChartWidget';
import { statisticsChartsScheme } from './constants/charts-scheme';

const WidgetsList = () => {
  return (
    <List>
      {
        statisticsChartsScheme.map((section) => (
          <ListItem
            key={ section.id }
            mb={ 8 }
            _last={{
              marginBottom: 0,
            }}
          >
            <Heading
              size="md"
              mb={ 4 }
            >
              { section.title }
            </Heading>

            <Grid
              templateColumns={{
                sm: 'repeat(2, 1fr)',
              }}
              gap={ 4 }
            >
              { section.charts.map((chart) => (
                <GridItem key={ chart.id }>
                  <ChartWidget
                    apiMethodURL={ chart.apiMethodURL }
                    title={ chart.title }
                    description={ chart.description }
                  />
                </GridItem>
              )) }
            </Grid>
          </ListItem>
        ))
      }
    </List>
  );
};

export default WidgetsList;
