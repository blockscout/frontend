import { Tr, Td, Tag, Flex, Text } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import InOutTag from 'ui/shared/InOutTag';
import TokenSnippet from 'ui/shared/TokenSnippet/TokenSnippet';
import { getTokenTransferTypeText } from 'ui/shared/TokenTransfer/helpers';
import TokenTransferNft from 'ui/shared/TokenTransfer/TokenTransferNft';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';

import CopyToClipboard from '../CopyToClipboard';

type Props = TokenTransfer & {
  baseAddress?: string;
  showTxInfo?: boolean;
  enableTimeIncrement?: boolean;
}

const TokenTransferTableItem = ({
  token,
  total,
  tx_hash: txHash,
  from,
  to,
  baseAddress,
  showTxInfo,
  type,
  timestamp,
  enableTimeIncrement,
}: Props) => {
  const timeAgo = useTimeAgoIncrement(timestamp, enableTimeIncrement);

  return (
    <Tr alignItems="top">
      { showTxInfo && txHash && (
        <Td>
          <TxAdditionalInfo hash={ txHash }/>
        </Td>
      ) }
      <Td>
        <Flex flexDir="column" alignItems="flex-start">
          <TokenSnippet hash={ token.address } name={ token.name || 'Unnamed token' } lineHeight="30px"/>
          <Tag mt={ 1 }>{ token.type }</Tag>
          <Tag colorScheme="orange" mt={ 2 }>{ getTokenTransferTypeText(type) }</Tag>
        </Flex>
      </Td>
      <Td lineHeight="30px">
        { 'token_id' in total && <TokenTransferNft hash={ token.address } id={ total.token_id }/> }
      </Td>
      { showTxInfo && txHash && (
        <Td>
          <Address display="inline-flex" maxW="100%" fontWeight={ 600 } lineHeight="30px">
            <AddressLink type="transaction" hash={ txHash }/>
          </Address>
          { timestamp && <Text color="gray.500" fontWeight="400" mt="10px">{ timeAgo }</Text> }
        </Td>
      ) }
      <Td>
        <Address display="inline-flex" maxW="100%" lineHeight="30px">
          <AddressIcon address={ from }/>
          <AddressLink type="address" ml={ 2 } fontWeight="500" hash={ from.hash } alias={ from.name } flexGrow={ 1 } isDisabled={ baseAddress === from.hash }/>
          { baseAddress !== from.hash && <CopyToClipboard text={ from.hash }/> }
        </Address>
      </Td>
      { baseAddress && (
        <Td px={ 0 }>
          <InOutTag isIn={ baseAddress === to.hash } isOut={ baseAddress === from.hash } w="50px" textAlign="center" mt="3px"/>
        </Td>
      ) }
      <Td>
        <Address display="inline-flex" maxW="100%" lineHeight="30px">
          <AddressIcon address={ to }/>
          <AddressLink type="address" ml={ 2 } fontWeight="500" hash={ to.hash } alias={ to.name } flexGrow={ 1 } isDisabled={ baseAddress === to.hash }/>
          { baseAddress !== to.hash && <CopyToClipboard text={ to.hash }/> }
        </Address>
      </Td>
      <Td isNumeric verticalAlign="top" lineHeight="30px">
        { 'value' in total && BigNumber(total.value).div(BigNumber(10 ** Number(total.decimals))).dp(8).toFormat() }
      </Td>
    </Tr>
  );
};

export default React.memo(TokenTransferTableItem);
