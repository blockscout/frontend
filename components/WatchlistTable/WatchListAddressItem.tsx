import React, { useCallback } from 'react';

import { Box, Icon } from '@chakra-ui/react';

import copyToClipboard from '../../lib/copyToClipboard';

import type { TWatchlistItem } from '../../data/watchlist';

const WatchListAddressItem = ({ item }: {item: TWatchlistItem}) => {
  const copyToClipboardCallback = useCallback(() => copyToClipboard(item.address), [ item ]);
  return (
    <Box display="flex">
      <Box backgroundColor="red" w={ 50 } h={ 50 } marginRight="16px"></Box>
      <Box>
        <Box>
          { item.address }
          { /* TODO: как быть с иконками? */ }
          <Icon color="red" w="20px" h="20px" cursor="pointer" onClick={ copyToClipboardCallback }>
            { /* eslint-disable-next-line max-len */ }
            <path d="M12.9091 3H5.27273C4.56955 3 4 3.56955 4 4.27273V13.1818H5.27273V4.27273H12.9091V3ZM14.8182 5.54545H7.81818C7.115 5.54545 6.54545 6.115 6.54545 6.81818V15.7273C6.54545 16.4305 7.115 17 7.81818 17H14.8182C15.5214 17 16.0909 16.4305 16.0909 15.7273V6.81818C16.0909 6.115 15.5214 5.54545 14.8182 5.54545ZM14.8182 15.7273H7.81818V6.81818H14.8182V15.7273Z" fill="#3F68C0"/>
          </Icon>
        </Box>
        <Box>{ item.tokens.xDAI.amount + ' ' + item.tokens.xDAI.symbol }</Box>
        <Box>{ Object.keys(item.tokens).length + 'tokens' }</Box>
        <Box>{ item.totalUSD }</Box>
      </Box>
    </Box>
  )
}

export default WatchListAddressItem;
