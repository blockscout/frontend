import type { ToastProps, AlertStatus } from '@chakra-ui/react';
import { Alert, AlertTitle, AlertDescription, CloseButton } from '@chakra-ui/react';
import { chakra } from '@chakra-ui/system';
import React from 'react';

function getBgColor(status?: AlertStatus) {
  switch (status) {
    case 'success':
      return 'green.100';

    case 'error':
      return 'red.100';

    case 'warning':
      return 'orange.100';

    case 'info':
    default:
      return 'blue.100';
  }
}

const Toast = ({ onClose, title, description, id, isClosable, status, icon }: ToastProps) => {

  const ids = id ?
    {
      root: `toast-${ id }`,
      title: `toast-${ id }-title`,
      description: `toast-${ id }-description`,
    } :
    undefined;

  const bgColor = getBgColor(status);

  return (
    <Alert
      id={ ids?.root }
      alignItems="start"
      borderRadius="md"
      boxShadow="lg"
      paddingY={ 4 }
      paddingLeft={ 6 }
      paddingRight="72px"
      color="gray.700"
      bgColor={ bgColor }
      textAlign="start"
      width="auto"
      maxWidth="400px"
    >
      <chakra.div flex="1" maxWidth="100%">
        { title && <AlertTitle id={ ids?.title } display="flex" alignItems="center">{ icon }{ title }</AlertTitle> }
        { description && (
          <AlertDescription id={ ids?.description } display="block">
            { description }
          </AlertDescription>
        ) }
      </chakra.div>
      { isClosable && (
        <CloseButton
          size="md"
          borderRadius="base"
          color="gray.700"
          onClick={ onClose }
          position="absolute"
          insetEnd={ 4 }
          top={ 4 }
        />
      ) }
    </Alert>
  );
};

export default Toast;
