import React from 'react';

import { INTEROP_MESSAGE } from 'stubs/optimismSuperchain';
import { generateListStub } from 'stubs/utils';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import CrossChainTxs from '../crossChainTxs/CrossChainTxs';

const OpSuperchainTxsCrossChain = () => {
  const { data, isError, isPlaceholderData } = useQueryWithPages({
    resourceName: 'multichain:interop_messages',
    options: {
      placeholderData: generateListStub<'multichain:interop_messages'>(INTEROP_MESSAGE, 50, { next_page_params: undefined }),
    },
  });

  return (
    <CrossChainTxs
      items={ data?.items }
      isLoading={ isPlaceholderData }
      isError={ isError }
      tableHeaderTop={ 0 }
    />
  );
};

export default React.memo(OpSuperchainTxsCrossChain);
