import { Text, Flex, Tag, Icon } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import eastArrowIcon from 'icons/arrows/east.svg';
import nftPlaceholder from 'icons/nft_placeholder.svg';
import AccountListItemMobile from 'ui/shared/AccountListItemMobile';
import AdditionalInfoButton from 'ui/shared/AdditionalInfoButton';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import InOutTag from 'ui/shared/InOutTag';
import TokenSnippet from 'ui/shared/TokenSnippet';

type Props = TokenTransfer & {
  baseAddress?: string;
}

const TokenTransferListItem = ({ token, total, tx_hash: txHash, from, to, baseAddress }: Props) => {
  const value = (() => {
    if (!('value' in total)) {
      return null;
    }

    return BigNumber(total.value).div(BigNumber(10 ** Number(total.decimals))).dp(8).toFormat();
  })();

  const addressWidth = `calc((100% - ${ baseAddress ? '50px' : '0px' }) / 2)`;
  return (
    <AccountListItemMobile rowGap={ 3 }>
      <Flex w="100%">
        <TokenSnippet hash={ token.address } w="auto" maxW="calc(100% - 140px)" name={ token.name || 'Unnamed token' }/>
        <Tag flexShrink={ 0 } ml={ 2 } mr="auto">{ token.type }</Tag>
        <AdditionalInfoButton/>
      </Flex>
      { 'token_id' in total && (
        <Flex alignItems="center">
          <Text fontWeight={ 500 }>Token ID</Text>
          <Icon mx={ 2 } as={ nftPlaceholder } boxSize="30px"/>
          <AddressLink hash={ token.address } id={ total.token_id } type="token_instance_item"/>
        </Flex>
      ) }
      <Flex columnGap={ 2 } w="100%">
        <Text fontWeight={ 500 } flexShrink={ 0 }>Txn hash</Text>
        <Address display="inline-flex" maxW="100%">
          <AddressLink type="transaction" hash={ txHash }/>
        </Address>
      </Flex>
      <Flex w="100%" columnGap={ 3 }>
        <Address width={ addressWidth }>
          <AddressIcon hash={ from.hash }/>
          <AddressLink ml={ 2 } fontWeight="500" hash={ from.hash }/>
        </Address>
        { baseAddress ?
          <InOutTag baseAddress={ baseAddress } addressFrom={ from.hash } w="50px" textAlign="center"/> :
          <Icon as={ eastArrowIcon } boxSize={ 6 } color="gray.500"/>
        }
        <Address width={ addressWidth }>
          <AddressIcon hash={ to.hash }/>
          <AddressLink ml={ 2 } fontWeight="500" hash={ to.hash }/>
        </Address>
      </Flex>
      { value && (
        <Flex columnGap={ 2 } w="100%">
          <Text fontWeight={ 500 } flexShrink={ 0 }>Value</Text>
          <Text variant="secondary">{ value }</Text>
        </Flex>
      ) }
    </AccountListItemMobile>
  );
};

export default React.memo(TokenTransferListItem);
