import React from 'react';

import TxsContent from 'ui/txs/TxsContent';

const BlockTxs = () => {
  return <TxsContent showDescription={ false } showSortButton={ false } txs={ [] }/>;
};

export default BlockTxs;
