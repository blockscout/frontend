// SPDX-License-Identifier: LicenseRef-Blockscout

import type { FlexProps } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import React from 'react';

import IndexingStatusBlocks from 'src/slices/chain/indexing-status/IndexingStatusBlocks';

import config from 'src/config';

import { Alert } from 'src/toolkit/chakra/alert';
import { BoxHtml } from 'src/toolkit/chakra/box';

const maintenanceAlertHtml = config.shell.header.maintenanceAlert.message || '';

const HeaderAlert = (props: FlexProps) => {
  return (
    <Flex flexDir="column" rowGap={ 1 } mb={{ base: 6, lg: 3 }} _empty={{ display: 'none' }} { ...props }>
      { maintenanceAlertHtml && <Alert status="info" showIcon><BoxHtml html={ maintenanceAlertHtml }/></Alert> }
      <IndexingStatusBlocks/>
    </Flex>
  );
};

export default React.memo(HeaderAlert);
