import React from 'react';

import TxsContent from 'ui/txs/TxsContent';

const BlockTxs = () => {
  return (
    <TxsContent
      showDescription={ false }
      showSortButton={ false }
      txs={ [] }
      page={ 1 }
      // eslint-disable-next-line react/jsx-no-bind
      onNextPageClick={ () => {} }
      // eslint-disable-next-line react/jsx-no-bind
      onPrevPageClick={ () => {} }
    />
  );
};

export default BlockTxs;
