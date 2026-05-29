// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text } from '@chakra-ui/react';
import React from 'react';

import { Alert } from 'src/toolkit/chakra/alert';
import { Link } from 'src/toolkit/chakra/link';
import { apos } from 'src/toolkit/utils/htmlEntities';

function ChainStatsErrorAlert() {
  return (
    <Alert status="warning" mb={ 4 } closable>
      <Text mr={ 2 }>
        { `Some of the charts did not load because the server didn${ apos }t respond. To reload charts ` }
        <Link href={ window.document.location.href }>click once again.</Link>
      </Text>
    </Alert>
  );
}

export default ChainStatsErrorAlert;
