// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'client/slices/tx/types/api';
import type { TxsSocketType } from 'client/slices/tx/types/socket';

import type { TxsTranslationQuery } from 'client/features/tx-interpretation/noves/hooks/useDescribeTxs';

import useInitialList from 'client/shared/lists/useInitialList';
import useLazyRenderedList from 'client/shared/lists/useLazyRenderedList';

import { useMultichainContext } from 'lib/contexts/multichain';

import TxsSocketNotice from './socket/TxsSocketNotice';
import TxsListItem from './TxsListItem';

interface Props {
  showBlockInfo: boolean;
  socketType?: TxsSocketType;
  enableTimeIncrement?: boolean;
  currentAddress?: string;
  isLoading: boolean;
  items: Array<Transaction>;
  translationQuery?: TxsTranslationQuery;
}

const TxsList = (props: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList(props.items, !props.isLoading);
  const initialList = useInitialList({
    data: props.items ?? [],
    idFn: (item) => item.hash,
    enabled: !props.isLoading,
  });
  const multichainContext = useMultichainContext();
  const chainData = multichainContext?.chain;

  return (
    <Box>
      { props.socketType && <TxsSocketNotice type={ props.socketType } place="list" isLoading={ props.isLoading }/> }
      { props.items.slice(0, renderedItemsNum).map((tx, index) => {
        return (
          <TxsListItem
            key={ tx.hash + (props.isLoading ? index : '') }
            tx={ tx }
            showBlockInfo={ props.showBlockInfo }
            currentAddress={ props.currentAddress }
            enableTimeIncrement={ props.enableTimeIncrement }
            isLoading={ props.isLoading }
            animation={ initialList.getAnimationProp(tx) }
            chainData={ chainData }
            translationIsLoading={ props.translationQuery?.isLoading }
            translationData={ props.translationQuery?.data?.find(({ txHash }) => txHash.toLowerCase() === tx.hash.toLowerCase()) }
          />
        );
      }) }
      <Box ref={ cutRef } h={ 0 }/>
    </Box>
  );
};

export default React.memo(TxsList);
