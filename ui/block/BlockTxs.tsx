import React from 'react';

import TxsWithSort from 'ui/txs/TxsWithSort';

const BlockTxs = () => {
  return (
    // <TxsContent
    //   showDescription={ false }
    //   showSortButton={ false }
    //   txs={ [] }
    //   page={ 1 }
    //   // eslint-disable-next-line react/jsx-no-bind
    //   onNextPageClick={ () => {} }
    //   // eslint-disable-next-line react/jsx-no-bind
    //   onPrevPageClick={ () => {} }
    // />
    // eslint-disable-next-line react/jsx-no-bind
    <TxsWithSort txs={ [] } sort={ () => () => {} }/>
  );
};

export default BlockTxs;
