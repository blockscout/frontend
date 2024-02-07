import { Flex, Text, Link, useBoolean } from '@chakra-ui/react';
import React from 'react';

import NftEntity from 'ui/shared/entities/nft/NftEntity';

interface Props {
  items: Array<{total: { token_id: string | null} }>;
  tokenAddress: string;
  isLoading?: boolean;
}

const TxStateTokenIdList = ({ items, tokenAddress, isLoading }: Props) => {
  const [ isCut, setIsCut ] = useBoolean(true);

  return (
    <Flex flexDir="column" rowGap={ 2 }>
      { items.slice(0, isCut ? 3 : items.length).map((item, index) => {
        if (item.total.token_id !== null) {
          return (
            <NftEntity
              key={ index }
              hash={ tokenAddress }
              id={ item.total.token_id }
              isLoading={ isLoading }
            />
          );
        } else {
          return <Text key={ index } color="text_secondary">N/A</Text>;
        }
      }) }
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
