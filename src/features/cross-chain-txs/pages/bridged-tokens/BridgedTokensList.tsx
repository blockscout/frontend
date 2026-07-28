// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { ChainInfo, StatsBridgedTokenRow } from '@blockscout/interchain-indexer-types';

import config from 'src/config';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import BridgedTokensListItem from './BridgedTokensListItem';

interface Props {
  data: Array<StatsBridgedTokenRow>;
  page: number;
  isLoading?: boolean;
  resetKey?: string;
  chainsData?: Array<ChainInfo>;
}

const BridgedTokensList = ({ data, page, isLoading, resetKey, chainsData }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  return (
    <Box>
      { data.slice(0, renderedItemsNum).map((item, index) => {
        const tokenInfo = item.tokens.find((token) => String(token.chain_id) === config.chain.id) ||
        item.tokens.find((token) => String(token.chain_id) !== config.chain.id);
        const chainInfo = chainsData?.find((chain) => chain.id === tokenInfo?.chain_id);

        return (
          <BridgedTokensListItem
            key={ String(tokenInfo?.token_address) + (isLoading ? index : '') }
            data={ item }
            tokenInfo={ tokenInfo }
            chainInfo={ chainInfo }
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
