// SPDX-License-Identifier: LicenseRef-Blockscout

import type { FlexProps } from '@chakra-ui/react';
import { Flex } from '@chakra-ui/react';
import React from 'react';

import IndexingStatusBlocks from 'src/slices/chain/indexing-status/IndexingStatusBlocks';

import config from 'src/config';
import * as mixpanel from 'src/services/mixpanel';

import { Alert } from 'src/toolkit/chakra/alert';
import { BoxHtml } from 'src/toolkit/chakra/box';

const maintenanceAlertHtml = config.shell.header.maintenanceAlert.message || '';

const handleLinkClick = (event: React.MouseEvent<HTMLDivElement>): void => {
  if (event.button > 1 || !(event.target instanceof Element)) {
    return;
  }

  const link = event.target.closest('a[href]');
  if (!(link instanceof HTMLAnchorElement) || !event.currentTarget.contains(link)) {
    return;
  }

  mixpanel.logEvent(mixpanel.EventTypes.PROMO_BANNER, { Source: 'Header', Link: link.href });
};

const HeaderAlert = (props: FlexProps) => {
  return (
    <Flex flexDir="column" rowGap={ 1 } mb={{ base: 6, lg: 3 }} _empty={{ display: 'none' }} { ...props }>
      { maintenanceAlertHtml && (
        <Alert status="info" showIcon>
          <BoxHtml html={ maintenanceAlertHtml } onClick={ handleLinkClick } onAuxClick={ handleLinkClick }/>
        </Alert>
      ) }
      <IndexingStatusBlocks/>
    </Flex>
  );
};

export default React.memo(HeaderAlert);
