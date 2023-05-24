import { Tr, Td, Flex, Skeleton, Box } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import Tag from 'ui/shared/chakra/Tag';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import InOutTag from 'ui/shared/InOutTag';
import TokenSnippet from 'ui/shared/TokenSnippet/TokenSnippet';
import { getTokenTransferTypeText } from 'ui/shared/TokenTransfer/helpers';
import TokenTransferNft from 'ui/shared/TokenTransfer/TokenTransferNft';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';

type Props = TokenTransfer & {
  baseAddress?: string;
  showTxInfo?: boolean;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
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
  isLoading,
}: Props) => {
  const timeAgo = useTimeAgoIncrement(timestamp, enableTimeIncrement);

  return (
    <Tr alignItems="top">
      { showTxInfo && txHash && (
        <Td>
          <Box my="3px">
            <TxAdditionalInfo hash={ txHash } isLoading={ isLoading }/>
          </Box>
        </Td>
      ) }
      <Td>
        <Flex flexDir="column" alignItems="flex-start" my="3px" rowGap={ 2 }>
          <TokenSnippet data={ token } isLoading={ isLoading } hideSymbol/>
          <Tag isLoading={ isLoading }>{ token.type }</Tag>
          <Tag colorScheme="orange" isLoading={ isLoading }>{ getTokenTransferTypeText(type) }</Tag>
        </Flex>
      </Td>
      <Td>
        { 'token_id' in total && <TokenTransferNft hash={ token.address } id={ total.token_id } isLoading={ isLoading }/> }
      </Td>
      { showTxInfo && txHash && (
        <Td>
          <Address display="inline-flex" maxW="100%" fontWeight={ 600 } mt="7px">
            <AddressLink type="transaction" hash={ txHash } isLoading={ isLoading }/>
          </Address>
          { timestamp && (
            <Skeleton isLoaded={ !isLoading } color="text_secondary" fontWeight="400" mt="10px" display="inline-block">
              <span>{ timeAgo }</span>
            </Skeleton>
          ) }
        </Td>
      ) }
      <Td>
        <Address display="inline-flex" maxW="100%" my="3px">
          <AddressIcon address={ from } isLoading={ isLoading }/>
          <AddressLink
            type="address" ml={ 2 }
            fontWeight="500"
            hash={ from.hash }
            alias={ from.name }
            flexGrow={ 1 }
            isDisabled={ baseAddress === from.hash }
            isLoading={ isLoading }
          />
          { baseAddress !== from.hash && <CopyToClipboard text={ from.hash } isLoading={ isLoading }/> }
        </Address>
      </Td>
      { baseAddress && (
        <Td px={ 0 }>
          <Box mt="3px">
            <InOutTag
              isIn={ baseAddress === to.hash }
              isOut={ baseAddress === from.hash }
              w="50px"
              textAlign="center"
              isLoading={ isLoading }
            />
          </Box>
        </Td>
      ) }
      <Td>
        <Address display="inline-flex" maxW="100%" my="3px">
          <AddressIcon address={ to } isLoading={ isLoading }/>
          <AddressLink
            type="address"
            ml={ 2 }
            fontWeight="500"
            hash={ to.hash }
            alias={ to.name }
            flexGrow={ 1 }
            isDisabled={ baseAddress === to.hash }
            isLoading={ isLoading }
          />
          { baseAddress !== to.hash && <CopyToClipboard text={ to.hash } isLoading={ isLoading }/> }
        </Address>
      </Td>
      <Td isNumeric verticalAlign="top">
        <Skeleton isLoaded={ !isLoading } display="inline-block" my="7px">
          { 'value' in total && BigNumber(total.value).div(BigNumber(10 ** Number(total.decimals))).dp(8).toFormat() }
        </Skeleton>
      </Td>
    </Tr>
  );
};

export default React.memo(TokenTransferTableItem);
