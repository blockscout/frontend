import { Box, Flex, HStack, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { TransactionType } from '../../types/api/transaction';

import { route } from 'nextjs-routes';

import transactionIcon from 'icons/transactions.svg';
import Address from 'ui/shared/address/Address';
import AddressLink from 'ui/shared/address/AddressLink';
import Icon from 'ui/shared/chakra/Icon';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

import config from '../../configs/app';
import rightArrowIcon from '../../icons/arrows/east.svg';
import getValueWithUnit from '../../lib/getValueWithUnit';
import AddressIcon from '../shared/address/AddressIcon';
import CopyToClipboard from '../shared/CopyToClipboard';
import LinkInternal from '../shared/LinkInternal';
import type { QueryWithPagesResult } from '../shared/pagination/useQueryWithPages';
import TxStatus from '../shared/TxStatus';
import TxAdditionalInfo from '../txs/TxAdditionalInfo';
import TxType from '../txs/TxType';

interface IProps {
  query: QueryWithPagesResult<'aspect_transactions'>;
}

const AspectTxsList = ({ query }: IProps) => {
  return (
    <div>
      { query.data?.items ? query.data.items.map((item, index) => (
        <ListItemMobile
          display="block"
          width="100%"
          isAnimated
          key={ query.isPlaceholderData ? index : item.block_hash }
        >
          <Flex justifyContent="space-between" mt={ 4 }>
            <HStack>
              <TxType
                rawInput=""
                types={ [ item.type ] as Array<TransactionType> }
                isLoading={ query.isPlaceholderData }
              />
              <TxStatus
                status={ item.status }
                errorText={ item.status === 'error' ? item.result : undefined }
                isLoading={ query.isPlaceholderData }
              />
            </HStack>
            <TxAdditionalInfo isMobile hash={ item.hash } isLoading={ query.isPlaceholderData }/>
          </Flex>
          <Flex
            justifyContent="space-between"
            lineHeight="24px"
            mt={ 3 }
            alignItems="center"
          >
            <Flex>
              <Icon as={ transactionIcon } boxSize="30px" color="link" isLoading={ query.isPlaceholderData }/>
              <Address width="100%" ml={ 2 }>
                <AddressLink
                  hash={ item.hash }
                  type="transaction"
                  fontWeight="700"
                  truncation="constant"
                  isLoading={ query.isPlaceholderData }
                />
              </Address>
            </Flex>
          </Flex>
          <Box mt={ 2 }>
            <Skeleton isLoaded={ !query.isPlaceholderData } display="inline-block" whiteSpace="pre">
              Block{ ' ' }
            </Skeleton>
            <Skeleton isLoaded={ !query.isPlaceholderData } display="inline-block">
              <LinkInternal
                href={ route({
                  pathname: '/block/[height_or_hash]',
                  query: { height_or_hash: item.block_number.toString() },
                }) }
              >
                { item.block_number }
              </LinkInternal>
            </Skeleton>
          </Box>
          <Flex height={ 6 } mt={ 6 }>
            <Address>
              <AddressIcon
                isLoading={ query.isPlaceholderData }
                address={{
                  hash: item.from_address_hash,
                  is_contract: false,
                  implementation_name: '',
                }}
              />
              <AddressLink
                type="address"
                hash={ item.from_address_hash }
                fontWeight="500"
                ml={ 2 }
                truncation="constant"
                isLoading={ query.isPlaceholderData }
              />
              <CopyToClipboard text={ item.from_address_hash } isLoading={ query.isPlaceholderData }/>
            </Address>
            <Box mx={ 2 }>
              <Icon as={ rightArrowIcon } boxSize={ 6 } color="gray.500" isLoading={ query.isPlaceholderData }/>
            </Box>
            <Address>
              <AddressIcon
                address={{
                  hash: item.to_address_hash,
                  is_contract: false,
                  implementation_name: '',
                }}
                isLoading={ query.isPlaceholderData }
              />
              <AddressLink
                type="address"
                hash={ item.to_address_hash }
                fontWeight="500"
                ml={ 2 }
                truncation="constant"
                isLoading={ query.isPlaceholderData }
              />
              <CopyToClipboard text={ item.to_address_hash } isLoading={ query.isPlaceholderData }/>
            </Address>
          </Flex>
          <Box mt={ 2 }>
            <Skeleton isLoaded={ !query.isPlaceholderData } display="inline-block" whiteSpace="pre">
              Value { config.chain.currency.symbol }{ ' ' }
            </Skeleton>
            <Skeleton isLoaded={ !query.isPlaceholderData } display="inline-block" variant="text_secondary">
              { getValueWithUnit(item.value).toFormat() }
            </Skeleton>
          </Box>
          <Box mt={ 2 } mb={ 3 }>
            <Skeleton isLoaded={ !query.isPlaceholderData } display="inline-block" whiteSpace="pre">
              Fee { config.chain.currency.symbol }{ ' ' }
            </Skeleton>
            <Skeleton isLoaded={ !query.isPlaceholderData } display="inline-block" variant="text_secondary">
              { getValueWithUnit(item.fee.value).toFormat() }
            </Skeleton>
          </Box>
        </ListItemMobile>
      )) : null }
    </div>
  );
};

export default React.memo(AspectTxsList);
