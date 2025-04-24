import { Flex } from '@chakra-ui/react';
import React from 'react';

import IndexingBlocksAlert from './alerts/IndexingBlocksAlert';
import MaintenanceAlert from './alerts/MaintenanceAlert';

const HeaderAlert = () => {
  return (
    <Flex flexDir="column" rowGap={ 3 } mb={{ base: 6, lg: 3 }} _empty={{ display: 'none' }}>
      <MaintenanceAlert/>
      <IndexingBlocksAlert/>
    </Flex>
  );
};

export default React.memo(HeaderAlert);
