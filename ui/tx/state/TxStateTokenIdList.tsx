import { Flex, Link, useBoolean } from '@chakra-ui/react';
import React from 'react';

import TokenTransferNft from 'ui/shared/TokenTransfer/TokenTransferNft';

import type { TxStateChangeNftItemFlatten } from './utils';

interface Props {
  items: Array<TxStateChangeNftItemFlatten>;
  tokenAddress: string;
}

const TxStateTokenIdList = ({ items, tokenAddress }: Props) => {
  const [ isCut, setIsCut ] = useBoolean(true);

  return (
    <Flex flexDir="column" rowGap={ 2 }>
      { items.slice(0, isCut ? 3 : items.length).map((item, index) => (
        <TokenTransferNft
          key={ index }
          hash={ tokenAddress }
          id={ item.total.token_id }
          w="auto"
          truncation="constant"
        />
      )) }
      { items.length > 3 && (
        <Link
          fontWeight={ 400 }
          textDecoration="underline dashed"
          _hover={{ textDecoration: 'underline dashed', color: 'link_hovered' }}
          onClick={ setIsCut.toggle }
          pb={{ base: '5px', md: 0 }}
        >
          View { isCut ? 'more' : 'less' }
        </Link>
      ) }
    </Flex>
  );
};

export default React.memo(TxStateTokenIdList);
