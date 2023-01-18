import { Alert, CloseButton, Link, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import { apos } from 'lib/html-entities';

function ChartsLoadingErrorAlert() {
  const {
    isOpen: isVisible,
    onClose,
  } = useDisclosure({ defaultIsOpen: true });

  return isVisible ? (
    <Alert status="warning" mb={ 4 }>
      <Text mr={ 2 }>
        { `Some of the charts did not load because the server didn${ apos }t respond. To reload charts ` }
        <Link href={ window.document.location.href }>click once again.</Link>
      </Text>

      <CloseButton
        alignSelf={{ base: 'flex-start', lg: 'center' }}
        ml="auto"
        onClick={ onClose }
      />
    </Alert>
  ) : null;
}

export default ChartsLoadingErrorAlert;
