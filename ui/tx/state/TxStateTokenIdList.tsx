import { Flex, Link, useBoolean } from '@chakra-ui/react';
import React from 'react';

import NftEntity from 'ui/shared/entities/nft/NftEntity';

interface Props {
  items: Array<{total: { token_id: string} }>;
  tokenAddress: string;
  isLoading?: boolean;
}

const TxStateTokenIdList = ({ items, tokenAddress, isLoading }: Props) => {
  const [ isCut, setIsCut ] = useBoolean(true);

  return (
    <Flex flexDir="column" rowGap={ 2 }>
      { items.slice(0, isCut ? 3 : items.length).map((item, index) => (
        <NftEntity
          key={ index }
          hash={ tokenAddress }
          id={ item.total.token_id }
          isLoading={ isLoading }
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
