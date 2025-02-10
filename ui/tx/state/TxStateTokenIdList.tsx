import { Text } from '@chakra-ui/react';
import React from 'react';

import CutLinkList from 'toolkit/components/CutLink/CutLinkList';
import NftEntity from 'ui/shared/entities/nft/NftEntity';

interface Props {
  items: Array<{ total: { token_id: string | null } }>;
  tokenAddress: string;
  isLoading?: boolean;
}

const TxStateTokenIdList = ({ items, tokenAddress, isLoading }: Props) => {
  const renderItem = React.useCallback((item: typeof items[number], index: number) => {
    if (item.total.token_id !== null) {
      return <NftEntity key={ index } hash={ tokenAddress } id={ item.total.token_id } isLoading={ isLoading }/>;
    }

    return <Text key={ index } color="text.secondary">N/A</Text>;
  }, [ isLoading, tokenAddress ]);

  return (
    <CutLinkList
      items={ items }
      renderItem={ renderItem }
      linkProps={{
        pb: { base: '5px', md: 0 },
      }}
      rowGap={ 2 }
    />
  );
};

export default React.memo(TxStateTokenIdList);
