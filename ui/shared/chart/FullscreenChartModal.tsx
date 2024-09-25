import { Box, Button, Grid, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react';
import React from 'react';

import type { TimeChartItem } from './types';
import type { Resolution } from '@blockscout/stats-types';

import IconSvg from 'ui/shared/IconSvg';

import ChartWidgetContent from './ChartWidgetContent';

type Props = {
  isOpen: boolean;
  title: string;
  description?: string;
  items: Array<TimeChartItem>;
  onClose: () => void;
  units?: string;
  resolution?: Resolution;
  zoomRange?: [ Date, Date ];
  handleZoom: (range: [ Date, Date ]) => void;
  handleZoomReset: () => void;
}

const FullscreenChartModal = ({
  isOpen,
  title,
  description,
  items,
  units,
  onClose,
  resolution,
  zoomRange,
  handleZoom,
  handleZoomReset,
}: Props) => {
  return (
    <Modal
      isOpen={ isOpen }
      onClose={ onClose }
      size="full"
      isCentered
    >
      <ModalOverlay/>

      <ModalContent>

        <Box
          mb={ 1 }
        >
          <Grid
            gridColumnGap={ 2 }
          >
            <Heading
              mb={ 1 }
              size={{ base: 'xs', sm: 'md' }}
            >
              { title }
            </Heading>

            { description && (
              <Text
                gridColumn={ 1 }
                as="p"
                variant="secondary"
                fontSize="xs"
              >
                { description }
              </Text>
            ) }

            { Boolean(zoomRange) && (
              <Button
                leftIcon={ <IconSvg name="repeat" w={ 4 } h={ 4 }/> }
                colorScheme="blue"
                gridColumn={ 2 }
                justifySelf="end"
                alignSelf="top"
                gridRow="1/3"
                size="sm"
                variant="outline"
                onClick={ handleZoomReset }
              >
                Reset zoom
              </Button>
            ) }
          </Grid>
        </Box>

        <ModalCloseButton/>

        <ModalBody
          h="100%"
          margin={{ bottom: 60 }}
        >
          <ChartWidgetContent
            isEnlarged
            items={ items }
            units={ units }
            handleZoom={ handleZoom }
            zoomRange={ zoomRange }
            title={ title }
            resolution={ resolution }
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FullscreenChartModal;
