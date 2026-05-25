// SPDX-License-Identifier: LicenseRef-Blockscout

import type { FlexProps } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import React from 'react';

import IndexingStatusBlocks from 'client/slices/chain/indexing-status/IndexingStatusBlocks';

import AlertWithExternalHtml from 'client/shared/alerts/AlertWithExternalHtml';

import config from 'configs/app';

const maintenanceAlertHtml = config.UI.maintenanceAlert.message || '';

const HeaderAlert = (props: FlexProps) => {
  return (
    <Flex flexDir="column" rowGap={ 1 } mb={{ base: 6, lg: 3 }} _empty={{ display: 'none' }} { ...props }>
      { maintenanceAlertHtml && <AlertWithExternalHtml html={ maintenanceAlertHtml } status="info" showIcon/> }
      <IndexingStatusBlocks/>
    </Flex>
  );
};

export default React.memo(HeaderAlert);
