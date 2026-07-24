// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { StatsBridgedTokenRow } from '@blockscout/interchain-indexer-types';

import config from 'src/config';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import BridgedTokensListItem from './BridgedTokensListItem';

interface Props {
  data: Array<StatsBridgedTokenRow>;
  page: number;
  isLoading?: boolean;
  resetKey?: string;
}

const BridgedTokensList = ({ data, page, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  return (
    <Box>
      { data.slice(0, renderedItemsNum).map((item, index) => {
        const tokenCurrentChain = item.tokens.find((token) => String(token.chain_id) === config.chain.id);

        return (
          <BridgedTokensListItem
            key={ String(tokenCurrentChain?.token_address) + (isLoading ? index : '') }
            data={ item }
            token={ tokenCurrentChain }
            index={ index }
            page={ page }
            isLoading={ isLoading }
          />
        );
      }) }
      <Box ref={ cutRef } h={ 0 }/>
    </Box>
  );
};

export default React.memo(BridgedTokensList);
