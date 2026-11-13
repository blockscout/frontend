// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import * as analytics from 'src/shared/analytics';
import { route } from 'src/shared/router/routes';
import CopyToClipboard from 'src/shared/texts/CopyToClipboard';

import { Button } from 'src/toolkit/chakra/button';
import { Link } from 'src/toolkit/chakra/link';

const ANALYTICS_SOURCE = analytics.PAGE_TYPE_DICT['/tx/[hash]/receipt'];

interface Props {
  readonly hash: string;
}

const TxReceiptActions = ({ hash }: Props) => {
  const handleDetailsClick = React.useCallback(() => {
    analytics.logEvent(analytics.EventTypes.BUTTON_CLICK, { Content: 'Transaction details', Source: ANALYTICS_SOURCE });
  }, []);

  const handleCopyClick = React.useCallback(() => {
    analytics.logEvent(analytics.EventTypes.BUTTON_CLICK, { Content: 'Copy link', Source: ANALYTICS_SOURCE });
  }, []);

  return (
    <Flex columnGap={ 2 }>
      <Link
        href={ route({ pathname: '/tx/[hash]', query: { hash } }) }
        target="_blank"
        onClick={ handleDetailsClick }
        flexGrow={ 1 }
        asChild
      >
        <Button variant="subtle" size="md" w="100%">Transaction details</Button>
      </Link>
      <CopyToClipboard
        text={ route({ pathname: '/tx/[hash]/receipt', query: { hash } }, { absolute: true }) }
        type="link"
        variant="subtle"
        size="md"
        boxSize="auto"
        w="44px"
        h={ 10 }
        ml={ 0 }
        borderRadius="base"
        onClick={ handleCopyClick }
      />
    </Flex>
  );
};

export default React.memo(TxReceiptActions);
