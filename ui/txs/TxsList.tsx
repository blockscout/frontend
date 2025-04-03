import { Box } from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import useInitialList from 'lib/hooks/useInitialList';
import useLazyRenderedList from 'lib/hooks/useLazyRenderedList';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

import TxsListItem from './TxsListItem';

interface Props {
  showBlockInfo: boolean;
  showSocketInfo?: boolean;
  socketInfoAlert?: string;
  socketInfoNum?: number;
  enableTimeIncrement?: boolean;
  currentAddress?: string;
  isLoading: boolean;
  items: Array<Transaction>;
}

const TxsList = (props: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList(props.items, !props.isLoading);
  const initialList = useInitialList({
    data: props.items ?? [],
    idFn: (item) => item.hash,
    enabled: !props.isLoading,
  });

  return (
    <Box>
      { props.showSocketInfo && (
        <SocketNewItemsNotice.Mobile
          url={ window.location.href }
          num={ props.socketInfoNum }
          alert={ props.socketInfoAlert }
          isLoading={ props.isLoading }
        />
      ) }
      { props.items.slice(0, renderedItemsNum).map((tx, index) => (
        <TxsListItem
          key={ tx.hash + (props.isLoading ? index : '') }
          tx={ tx }
          showBlockInfo={ props.showBlockInfo }
          currentAddress={ props.currentAddress }
          enableTimeIncrement={ props.enableTimeIncrement }
          isLoading={ props.isLoading }
          animation={ initialList.getAnimationProp(tx) }
        />
      )) }
      <Box ref={ cutRef } h={ 0 }/>
    </Box>
  );
};

export default React.memo(TxsList);
