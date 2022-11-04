import { Tr, Td, Tag, Icon, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import nftPlaceholder from 'icons/nft_placeholder.svg';
import AdditionalInfoButton from 'ui/shared/AdditionalInfoButton';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import InOutTag from 'ui/shared/InOutTag';
import TokenSnippet from 'ui/shared/TokenSnippet';

type Props = TokenTransfer & {
  baseAddress?: string;
}

const TxInternalTableItem = ({ token, total, tx_hash: txHash, from, to, baseAddress }: Props) => {
  const value = (() => {
    if (!('value' in total)) {
      return '-';
    }

    return BigNumber(total.value).div(BigNumber(10 ** Number(total.decimals))).dp(8).toFormat();
  })();

  return (
    <Tr alignItems="top">
      <Td>
        <AdditionalInfoButton/>
      </Td>
      <Td>
        <Flex flexDir="column" rowGap={ 3 } alignItems="flex-start">
          <TokenSnippet hash={ token.address } name={ token.name || 'Unnamed token' }/>
          <Tag>{ token.type }</Tag>
        </Flex>
      </Td>
      <Td>
        { 'token_id' in total ? (
          <Flex align="center">
            <Icon as={ nftPlaceholder } boxSize="30px" mr={ 2 }/>
            <AddressLink hash={ token.address } id={ total.token_id } type="token_instance_item"/>
          </Flex>
        ) : '-' }
      </Td>
      <Td>
        <Address display="inline-flex" maxW="100%" fontWeight={ 600 }>
          <AddressLink type="transaction" hash={ txHash }/>
        </Address>
      </Td>
      <Td>
        <Address display="inline-flex" maxW="100%">
          <AddressIcon hash={ from.hash }/>
          <AddressLink ml={ 2 } fontWeight="500" hash={ from.hash } alias={ from.name } flexGrow={ 1 }/>
        </Address>
      </Td>
      { baseAddress && (
        <Td px={ 0 }>
          <InOutTag baseAddress={ baseAddress } addressFrom={ from.hash } w="50px" textAlign="center"/>
        </Td>
      ) }
      <Td>
        <Address display="inline-flex" maxW="100%">
          <AddressIcon hash={ to.hash }/>
          <AddressLink ml={ 2 } fontWeight="500" hash={ to.hash } alias={ to.name } flexGrow={ 1 }/>
        </Address>
      </Td>
      <Td isNumeric verticalAlign="top">
        { value }
      </Td>
    </Tr>
  );
};

export default React.memo(TxInternalTableItem);
