import { Tr, Td, Tag, Icon, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import nftPlaceholder from 'icons/nft_shield.svg';
import AdditionalInfoButton from 'ui/shared/AdditionalInfoButton';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import InOutTag from 'ui/shared/InOutTag';
import TokenSnippet from 'ui/shared/TokenSnippet';
import { getTokenTransferTypeText } from 'ui/shared/TokenTransfer/helpers';

type Props = TokenTransfer & {
  baseAddress?: string;
  showTxInfo?: boolean;
}

const TxInternalTableItem = ({ token, total, tx_hash: txHash, from, to, baseAddress, showTxInfo, type }: Props) => {
  const value = (() => {
    if (!('value' in total)) {
      return '-';
    }

    return BigNumber(total.value).div(BigNumber(10 ** Number(total.decimals))).dp(8).toFormat();
  })();

  return (
    <Tr alignItems="top">
      { showTxInfo && (
        <Td>
          <AdditionalInfoButton/>
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
        { 'token_id' in total ? (
          <Flex align="center">
            <Icon as={ nftPlaceholder } boxSize="30px" mr={ 1 }/>
            <AddressLink hash={ token.address } id={ total.token_id } type="token_instance_item"/>
          </Flex>
        ) : '-' }
      </Td>
      { showTxInfo && (
        <Td>
          <Address display="inline-flex" maxW="100%" fontWeight={ 600 } lineHeight="30px">
            <AddressLink type="transaction" hash={ txHash }/>
          </Address>
        </Td>
      ) }
      <Td>
        <Address display="inline-flex" maxW="100%" lineHeight="30px">
          <AddressIcon hash={ from.hash }/>
          <AddressLink ml={ 2 } fontWeight="500" hash={ from.hash } alias={ from.name } flexGrow={ 1 }/>
        </Address>
      </Td>
      { baseAddress && (
        <Td px={ 0 }>
          <InOutTag baseAddress={ baseAddress } addressFrom={ from.hash } w="50px" textAlign="center" mt="3px"/>
        </Td>
      ) }
      <Td>
        <Address display="inline-flex" maxW="100%" lineHeight="30px">
          <AddressIcon hash={ to.hash }/>
          <AddressLink ml={ 2 } fontWeight="500" hash={ to.hash } alias={ to.name } flexGrow={ 1 }/>
        </Address>
      </Td>
      <Td isNumeric verticalAlign="top" lineHeight="30px">
        { value }
      </Td>
    </Tr>
  );
};

export default React.memo(TxInternalTableItem);
