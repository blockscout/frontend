import { Grid, Text } from '@chakra-ui/react';
import React from 'react';

import type { TimeChartItem } from './types';
import type { Resolution } from '@blockscout/stats-types';

import { Button } from 'toolkit/chakra/button';
import { DialogBody, DialogContent, DialogHeader, DialogRoot } from 'toolkit/chakra/dialog';
import { Heading } from 'toolkit/chakra/heading';
import IconSvg from 'ui/shared/IconSvg';

import ChartWidgetContent from './ChartWidgetContent';

type Props = {
  open: boolean;
  onOpenChange: ({ open }: { open: boolean }) => void;
  title: string;
  description?: string;
  items: Array<TimeChartItem>;
  units?: string;
  resolution?: Resolution;
  zoomRange?: [ Date, Date ];
  handleZoom: (range: [ Date, Date ]) => void;
  handleZoomReset: () => void;
};

const FullscreenChartModal = ({
  open,
  onOpenChange,
  title,
  description,
  items,
  units,
  resolution,
  zoomRange,
  handleZoom,
  handleZoomReset,
}: Props) => {
  return (
    <DialogRoot
      open={ open }
      onOpenChange={ onOpenChange }
      // FIXME: with size="full" the chart will not be expanded to the full height of the modal
      size="cover"
    >
      <DialogContent>
        <DialogHeader/>
        <DialogBody pt={ 6 } display="flex" flexDir="column">
          <Grid gridColumnGap={ 2 } mb={ 4 }>
            <Heading mb={ 1 } level="2">
              { title }
            </Heading>

            { description && (
              <Text
                gridColumn={ 1 }
                color="text.secondary"
                textStyle="sm"
              >
                { description }
              </Text>
            ) }

            { Boolean(zoomRange) && (
              <Button
                gridColumn={ 2 }
                justifySelf="end"
                alignSelf="top"
                gridRow="1/3"
                size="sm"
                variant="outline"
                onClick={ handleZoomReset }
              >
                <IconSvg name="repeat" w={ 4 } h={ 4 }/>
                Reset zoom
              </Button>
            ) }
          </Grid>
          <ChartWidgetContent
            isEnlarged
            items={ items }
            units={ units }
            handleZoom={ handleZoom }
            zoomRange={ zoomRange }
            title={ title }
            resolution={ resolution }
          />
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default FullscreenChartModal;
