import { Box } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { Alert } from 'toolkit/chakra/alert';

// TODO @tom2drum fix this alert
const MaintenanceAlert = () => {
  if (!config.UI.maintenanceAlert.message) {
    return null;
  }

  return (
    <Alert status="info" colorScheme="gray" py={ 3 } borderRadius="md">
      { /* <AlertIcon display={{ base: 'none', lg: 'flex' }}/> */ }
      <Box
        dangerouslySetInnerHTML={{ __html: config.UI.maintenanceAlert.message }}
        css={{
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
