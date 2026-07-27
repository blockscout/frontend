// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { CctxListItem } from '@blockscout/zetachain-cctx-types';

import useInitialList from 'src/shared/lists/useInitialList';
import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import ZetaChainCCTxsListItem from './ZetaChainCCTXListItem';

type Props = {
  txs: Array<CctxListItem>;
  isLoading?: boolean;
  resetKey?: string;
};

const ZetaChainCCTxsList = ({ txs, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: txs, isEnabled: !isLoading, resetKey });
  const initialList = useInitialList({
    data: txs,
    idFn: (item) => item.index,
    enabled: !isLoading,
  });

  return (
    <Box>
      { txs.slice(0, renderedItemsNum).map((item, index) => (
        <ZetaChainCCTxsListItem
          key={ item.index + (isLoading ? index : '') }
          tx={ item }
          isLoading={ isLoading }
          animation={ initialList.getAnimationProp(item) }
        />
      )) }
      <Box ref={ cutRef } h={ 0 }/>
    </Box>
  );
};

export default React.memo(ZetaChainCCTxsList);
