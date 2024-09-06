import { Box, Button, Grid, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { TimeChartItem } from './types';

import IconSvg from 'ui/shared/IconSvg';

import ChartWidgetContent from './ChartWidgetContent';

type Props = {
  isOpen: boolean;
  title: string;
  description?: string;
  items: Array<TimeChartItem>;
  onClose: () => void;
  units?: string;
}

const FullscreenChartModal = ({
  isOpen,
  title,
  description,
  items,
  units,
  onClose,
}: Props) => {
  const [ isZoomResetInitial, setIsZoomResetInitial ] = React.useState(true);

  const handleZoom = useCallback(() => {
    setIsZoomResetInitial(false);
  }, []);

  const handleZoomReset = useCallback(() => {
    setIsZoomResetInitial(true);
  }, []);

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

            { !isZoomResetInitial && (
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
            isZoomResetInitial={ isZoomResetInitial }
            title={ title }
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FullscreenChartModal;
