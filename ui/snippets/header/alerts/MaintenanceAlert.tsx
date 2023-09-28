import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';

const MaintenanceAlert = () => {
  if (!config.UI.maintenanceAlert.message) {
    return null;
  }

  return (
    <Alert status="info" colorScheme="gray" py={ 3 } borderRadius="md">
      <AlertIcon display={{ base: 'none', lg: 'flex' }}/>
      <AlertTitle
        dangerouslySetInnerHTML={{ __html: config.UI.maintenanceAlert.message }}
        sx={{
          '& a': {
            color: 'link',
            _hover: {
              color: 'link_hovered',
            },
          },
        }}
      />
    </Alert>
  );
};

export default MaintenanceAlert;
