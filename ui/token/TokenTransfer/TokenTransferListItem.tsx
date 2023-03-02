import { Text, Flex, Tag, Icon, useColorModeValue } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import eastArrowIcon from 'icons/arrows/east.svg';
import transactionIcon from 'icons/transactions.svg';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import trimTokenSymbol from 'lib/token/trimTokenSymbol';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TokenTransferNft from 'ui/shared/TokenTransfer/TokenTransferNft';

type Props = TokenTransfer & {tokenId?: string};

const TokenTransferListItem = ({
  token,
  total,
  tx_hash: txHash,
  from,
  to,
  method,
  timestamp,
  tokenId,
}: Props) => {
  const value = (() => {
    if (!('value' in total)) {
      return null;
    }

    return BigNumber(total.value).div(BigNumber(10 ** Number(total.decimals))).dp(8).toFormat();
  })();

  const iconColor = useColorModeValue('blue.600', 'blue.300');

  const timeAgo = useTimeAgoIncrement(timestamp, true);

  return (
    <ListItemMobile rowGap={ 3 } isAnimated>
      <Flex justifyContent="space-between" alignItems="center" lineHeight="24px" width="100%">
        <Flex>
          <Icon
            as={ transactionIcon }
            boxSize="30px"
            mr={ 2 }
            color={ iconColor }
          />
          <Address width="100%">
            <AddressLink
              hash={ txHash }
              type="transaction"
              fontWeight="700"
              truncation="constant"
            />
          </Address>
        </Flex>
        { timestamp && <Text variant="secondary" fontWeight="400" fontSize="sm">{ timeAgo }</Text> }
      </Flex>
      { method && <Tag colorScheme="gray">{ method }</Tag> }
      <Flex w="100%" columnGap={ 3 }>
        <Address width="50%">
          <AddressIcon address={ from }/>
          <AddressLink ml={ 2 } fontWeight="500" hash={ from.hash } type="address_token" tokenHash={ token.address }/>
        </Address>
        <Icon as={ eastArrowIcon } boxSize={ 6 } color="gray.500"/>
        <Address width="50%">
          <AddressIcon address={ to }/>
          <AddressLink ml={ 2 } fontWeight="500" hash={ to.hash } type="address_token" tokenHash={ token.address }/>
        </Address>
      </Flex>
      { value && (token.type === 'ERC-20' || token.type === 'ERC-1155') && (
        <Flex columnGap={ 2 } w="100%">
          <Text fontWeight={ 500 } flexShrink={ 0 }>Value</Text>
          <Text variant="secondary">{ value }</Text>
          <Text>{ trimTokenSymbol(token.symbol) }</Text>
        </Flex>
      ) }
      { 'token_id' in total && (token.type === 'ERC-721' || token.type === 'ERC-1155') &&
         <TokenTransferNft hash={ token.address } id={ total.token_id } isDisabled={ Boolean(tokenId && tokenId === total.token_id) }/> }
    </ListItemMobile>
  );
};

export default React.memo(TokenTransferListItem);
