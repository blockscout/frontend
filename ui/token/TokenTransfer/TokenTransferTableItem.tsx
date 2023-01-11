import { Tr, Td, Tag, Text, Icon } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import eastArrowIcon from 'icons/arrows/east.svg';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import { getTokenTransferTypeText } from 'ui/shared/TokenTransfer/helpers';
import TokenTransferNft from 'ui/shared/TokenTransfer/TokenTransferNft';

type Props = TokenTransfer

const TokenTransferTableItem = ({
  token,
  total,
  tx_hash: txHash,
  from,
  to,
  type,
  timestamp,
}: Props) => {
  const value = (() => {
    if (!('value' in total)) {
      return '-';
    }

    return BigNumber(total.value).div(BigNumber(10 ** Number(total.decimals))).dp(8).toFormat();
  })();

  const timeAgo = useTimeAgoIncrement(timestamp, true);

  return (
    <Tr alignItems="top">
      <Td>
        <Address display="inline-flex" maxW="100%" fontWeight={ 600 } lineHeight="30px">
          <AddressLink type="transaction" hash={ txHash }/>
        </Address>
        { timestamp && <Text color="gray.500" fontWeight="400" mt="10px">{ timeAgo }</Text> }
      </Td>
      <Td>
        <Tag colorScheme="orange">{ getTokenTransferTypeText(type) }</Tag>
      </Td>
      <Td>
        <Address display="inline-flex" maxW="100%" lineHeight="30px">
          <AddressIcon address={ from }/>
          <AddressLink ml={ 2 } fontWeight="500" hash={ from.hash } alias={ from.name } flexGrow={ 1 } truncation="constant"/>
        </Address>
      </Td>
      <Td px={ 0 }>
        <Icon as={ eastArrowIcon } boxSize={ 6 } color="gray.500"/>
      </Td>
      <Td>
        <Address display="inline-flex" maxW="100%" lineHeight="30px">
          <AddressIcon address={ to }/>
          <AddressLink ml={ 2 } fontWeight="500" hash={ to.hash } alias={ to.name } flexGrow={ 1 } truncation="constant"/>
        </Address>
      </Td>
      { (token.type === 'ERC-721' || token.type === 'ERC-1155') && (
        <Td lineHeight="30px">
          { 'token_id' in total ? (
            <TokenTransferNft
              hash={ token.address }
              id={ total.token_id }
              justifyContent={ token.type === 'ERC-721' ? 'end' : 'start' }/>
          ) : '-'
          }
        </Td>
      ) }
      { (token.type === 'ERC-20' || token.type === 'ERC-1155') && (
        <Td isNumeric verticalAlign="top" lineHeight="30px">
          { value || '-' }
        </Td>
      ) }
    </Tr>
  );
};

export default React.memo(TokenTransferTableItem);
