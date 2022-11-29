import { Box, Button, Grid, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import ChartWidgetGraph from './ChartWidgetGraph';
import { demoData } from './constants/demo-data';

type Props = {
  apiMethodURL: string;
  title: string;
  description: string;
}

const ChartWidget = ({ title, description }: Props) => {
  const [ isZoomResetInitial, setIsZoomResetInitial ] = React.useState(true);

  const handleZoom = useCallback(() => {
    setIsZoomResetInitial(false);
  }, []);

  const handleZoomResetClick = useCallback(() => {
    setIsZoomResetInitial(true);
  }, []);

  return (
    <Box
      padding={{ base: 3, md: 4 }}
      borderRadius="md"
      border="1px"
      borderColor={ useColorModeValue('gray.200', 'gray.600') }
    >
      <Grid>
        <Heading
          mb={ 1 }
          size={{ base: 'xs', md: 'sm' }}
        >
          { title }
        </Heading>

        <Text
          mb={ 1 }
          gridColumn={ 1 }
          as="p"
          variant="secondary"
          fontSize="xs"
        >
          { description }
        </Text>

        { !isZoomResetInitial && (
          <Button
            gridColumn={ 2 }
            justifySelf="end"
            alignSelf="center"
            gridRow="1/3"
            size="sm"
            variant="outline"
            onClick={ handleZoomResetClick }
          >
            Reset zoom
          </Button>
        ) }
      </Grid>

      <ChartWidgetGraph
        items={ demoData }
        onZoom={ handleZoom }
        isZoomResetInitial={ isZoomResetInitial }
        title={ title }
      />
    </Box>
  );
};

export default ChartWidget;
