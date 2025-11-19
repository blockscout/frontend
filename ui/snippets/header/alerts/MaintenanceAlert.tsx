import { Box } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import { Alert } from 'toolkit/chakra/alert';

const MaintenanceAlert = () => {
  if (!config.UI.maintenanceAlert.message) {
    return null;
  }

  return (
    <Alert status="info" showIcon>
      <Box
        dangerouslySetInnerHTML={{ __html: config.UI.maintenanceAlert.message }}
        css={{
          '& a': {
            color: 'link.primary',
            _hover: {
              color: 'link.primary.hover',
            },
          },
        }}

      />
    </Alert>
  );
};

export default MaintenanceAlert;
