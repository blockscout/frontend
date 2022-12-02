import { Box, Button, Grid, Heading, Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, useColorModeValue, VisuallyHidden } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { ModalChart } from 'types/client/stats';

import dotsIcon from 'icons/vertical-dots.svg';

import ChartWidgetGraph from './ChartWidgetGraph';
import { demoChartsData } from './constants/demo-charts-data';

type Props = {
  id: string;
  onFullscreenClick: (chart: ModalChart) => void;
  apiMethodURL: string;
  title: string;
  description: string;
}

const ChartWidget = ({ id, title, description, onFullscreenClick }: Props) => {
  const [ isZoomResetInitial, setIsZoomResetInitial ] = React.useState(true);

  const handleZoom = useCallback(() => {
    setIsZoomResetInitial(false);
  }, []);

  const handleZoomResetClick = useCallback(() => {
    setIsZoomResetInitial(true);
  }, []);

  const handleFullscreenClick = useCallback(() => {
    onFullscreenClick({ id, title });
  }, [ id, title, onFullscreenClick ]);

  return (
    <Box
      padding={{ base: 3, md: 4 }}
      borderRadius="md"
      border="1px"
      borderColor={ useColorModeValue('gray.200', 'gray.600') }
    >
      <Grid
        gridTemplateColumns="auto auto 36px"
        gridColumnGap={ 4 }
      >
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
            alignSelf="top"
            gridRow="1/3"
            size="sm"
            variant="outline"
            onClick={ handleZoomResetClick }
          >
            Reset zoom
          </Button>
        ) }

        <Menu>
          <MenuButton
            gridColumn={ 3 }
            gridRow="1/3"
            justifySelf="end"
            w="36px"
            h="32px"
            icon={ <Icon as={ dotsIcon } w={ 4 } h={ 4 } color={ useColorModeValue('black', 'white') }/> }
            colorScheme="transparent"
            as={ IconButton }
          >
            <VisuallyHidden>
                Open chart options menu
            </VisuallyHidden>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={ handleFullscreenClick }>View fullscreen</MenuItem>
          </MenuList>
        </Menu>
      </Grid>

      <ChartWidgetGraph
        items={ demoChartsData }
        onZoom={ handleZoom }
        isZoomResetInitial={ isZoomResetInitial }
        title={ title }
      />
    </Box>
  );
};

export default ChartWidget;
