import { Button, Flex, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React, { useCallback } from 'react';

import ChartWidgetGraph from './ChartWidgetGraph';
import { demoChartsData } from './constants/demo-charts-data';

type Props = {
  id: string;
  title: string;
  onClose: () => void;
}

const FullscreenChartModal = ({
  id,
  title,
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
      isOpen={ Boolean(id) }
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
          h="100%"
        >
          <ChartWidgetGraph
            items={ demoChartsData }
            onZoom={ handleZoom }
            isZoomResetInitial={ isZoomResetInitial }
            title="test"
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FullscreenChartModal;
