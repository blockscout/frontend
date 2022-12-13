import { Button, Flex, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import type { TimeChartItem } from '../shared/chart/types';

import ChartWidgetGraph from './ChartWidgetGraph';

type Props = {
  isOpen: boolean;
  title: string;
  items: Array<TimeChartItem>;
  onClose: () => void;
}

const FullscreenChartModal = ({
  isOpen,
  title,
  items,
  onClose,
}: Props) => {
  const [ isZoomResetInitial, setIsZoomResetInitial ] = React.useState(true);

  const handleZoom = useCallback(() => {
    setIsZoomResetInitial(false);
  }, []);

  const handleZoomResetClick = useCallback(() => {
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

        <ModalHeader>
          <Flex
            alignItems="center"
          >
            <Heading
              as="h2"
              gridColumn={ 2 }
              fontSize={{ base: '2xl', sm: '3xl' }}
              fontWeight="medium"
              lineHeight={ 1 }
              color="blue.600"
            >
              { title }
            </Heading>

            { !isZoomResetInitial && (
              <Button
                ml="auto"
                gridColumn={ 2 }
                justifySelf="end"
                alignSelf="top"
                gridRow="1/3"
                size="md"
                variant="outline"
                onClick={ handleZoomResetClick }
              >
                  Reset zoom
              </Button>
            ) }
          </Flex>
        </ModalHeader>

        <ModalCloseButton/>

        <ModalBody
          h="75%"
        >
          <ChartWidgetGraph
            items={ items }
            onZoom={ handleZoom }
            isZoomResetInitial={ isZoomResetInitial }
            title={ title }
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FullscreenChartModal;
