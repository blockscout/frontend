import { Text, Flex, Tag, Icon } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import eastArrowIcon from 'icons/arrows/east.svg';
import AccountListItemMobile from 'ui/shared/AccountListItemMobile';
import AdditionalInfoButton from 'ui/shared/AdditionalInfoButton';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import InOutTag from 'ui/shared/InOutTag';
import TokenSnippet from 'ui/shared/TokenSnippet/TokenSnippet';
import { getTokenTransferTypeText } from 'ui/shared/TokenTransfer/helpers';
import TokenTransferNft from 'ui/shared/TokenTransfer/TokenTransferNft';

type Props = TokenTransfer & {
  baseAddress?: string;
  showTxInfo?: boolean;
}

const TokenTransferListItem = ({ token, total, tx_hash: txHash, from, to, baseAddress, showTxInfo, type }: Props) => {
  const value = (() => {
    if (!('value' in total)) {
      return null;
    }

    return BigNumber(total.value).div(BigNumber(10 ** Number(total.decimals))).dp(8).toFormat();
  })();

  const addressWidth = `calc((100% - ${ baseAddress ? '50px' : '0px' }) / 2)`;
  return (
    <AccountListItemMobile rowGap={ 3 }>
      <Flex w="100%" flexWrap="wrap" rowGap={ 1 } position="relative">
        <TokenSnippet hash={ token.address } w="auto" maxW="calc(100% - 140px)" name={ token.name || 'Unnamed token' }/>
        <Tag flexShrink={ 0 } ml={ 2 } mr={ 2 }>{ token.type }</Tag>
        <Tag colorScheme="orange">{ getTokenTransferTypeText(type) }</Tag>
        { showTxInfo && <AdditionalInfoButton position="absolute" top={ 0 } right={ 0 }/> }
      </Flex>
      { 'token_id' in total && <TokenTransferNft hash={ token.address } id={ total.token_id }/> }
      { showTxInfo && (
        <Flex columnGap={ 2 } w="100%">
          <Text fontWeight={ 500 } flexShrink={ 0 }>Txn hash</Text>
          <Address display="inline-flex" maxW="100%">
            <AddressLink type="transaction" hash={ txHash }/>
          </Address>
        </Flex>
      ) }
      <Flex w="100%" columnGap={ 3 }>
        <Address width={ addressWidth }>
          <AddressIcon hash={ from.hash }/>
          <AddressLink ml={ 2 } fontWeight="500" hash={ from.hash }/>
        </Address>
        { baseAddress ?
          <InOutTag isIn={ baseAddress === to.hash } isOut={ baseAddress === from.hash } w="50px" textAlign="center"/> :
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
