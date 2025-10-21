import type { FlexProps } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import React from 'react';

import IndexingBlocksAlert from './alerts/IndexingBlocksAlert';
import MaintenanceAlert from './alerts/MaintenanceAlert';

const HeaderAlert = (props: FlexProps) => {
  return (
    <Flex flexDir="column" rowGap={ 1 } mb={{ base: 6, lg: 3 }} _empty={{ display: 'none' }} { ...props }>
      <MaintenanceAlert/>
      <IndexingBlocksAlert/>
    </Flex>
  );
};

export default React.memo(HeaderAlert);
