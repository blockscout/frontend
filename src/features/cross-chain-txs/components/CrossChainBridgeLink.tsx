// SPDX-License-Identifier: LicenseRef-Blockscout

import type { JsxStyleProps } from '@chakra-ui/react';
import React from 'react';

import type { BridgeInfo } from '@blockscout/interchain-indexer-types';

import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';

interface Props extends JsxStyleProps {
  data: BridgeInfo | undefined;
  isLoading?: boolean;
  messageId?: string;
}

const CrossChainBridgeLink = ({ data, isLoading, messageId, ...rest }: Props) => {

  if (!data) {
    return null;
  }

  if (data.ui_url || data.docs_url) {

    const uiUrl = messageId && data.ui_url ? data.ui_url.replace('{{message_id}}', messageId) : data.ui_url;

    return (
      <Link href={ uiUrl || data.docs_url } external loading={ isLoading } { ...rest }>
        { data.name }
      </Link>
    );
  }

  return (
    <Skeleton loading={ isLoading } { ...rest }>{ data.name }</Skeleton>
  );
};

export default React.memo(CrossChainBridgeLink);
