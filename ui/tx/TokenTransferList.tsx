import { Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer as TTokenTransfer } from 'types/api/tokenTransfer';

import TokenTransfer from 'ui/tx/TokenTransfer';

interface Props {
  items: Array<TTokenTransfer>;
}

function getItemsNum(items: Array<TTokenTransfer>) {
  const nonErc1155items = items.filter((item) => item.token.type !== 'ERC-1155').length;
  const erc1155items = items
    .filter((item) => item.token.type === 'ERC-1155')
    .map((item) => {
      if (Array.isArray(item.total)) {
        return item.total.length;
      }

      return 1;
    })
    .reduce((sum, item) => sum + item, 0);

  return nonErc1155items + erc1155items;
}

const TokenTransferList = ({ items }: Props) => {
  const itemsNum = getItemsNum(items);
  const hasScroll = itemsNum > 5;

  const gradientStartColor = useColorModeValue('whiteAlpha.600', 'blackAlpha.600');
  const gradientEndColor = useColorModeValue('whiteAlpha.900', 'blackAlpha.900');

  return (
    <Flex
      flexDirection="column"
      alignItems="flex-start"
      rowGap={ 5 }
      w="100%"
      _after={ hasScroll ? {
        position: 'absolute',
        content: '""',
        bottom: 0,
        left: 0,
        right: '20px',
        height: '48px',
        bgGradient: `linear(to-b, ${ gradientStartColor } 37.5%, ${ gradientEndColor } 77.5%)`,
      } : undefined }
      maxH={ hasScroll ? '200px' : 'auto' }
      overflowY={ hasScroll ? 'scroll' : 'auto' }
      pr={ hasScroll ? 5 : 0 }
      pb={ hasScroll ? 10 : 0 }
    >
      { items.map((item, index) => <TokenTransfer key={ index } { ...item }/>) }
    </Flex>
  );
};

export default React.memo(TokenTransferList);
