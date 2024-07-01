import { Box, Flex, HStack, Skeleton } from '@chakra-ui/react';
import React from 'react';

import type { AspectTxs } from '../../types/api/aspect';
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
import TxStatus from '../shared/TxStatus';
import TxAdditionalInfo from '../txs/TxAdditionalInfo';
import TxType from '../txs/TxType';

interface IProps {
  data: Array<AspectTxs>;
}

const AspectTxsList = ({ data }: IProps) => {
  return (
    <>
      { data.map((item) => (
        <ListItemMobile
          display="block"
          width="100%"
          isAnimated
          key={ item.block_hash }
        >
          <Flex justifyContent="space-between" mt={ 4 }>
            <HStack>
              <TxType
                rawInput=""
                types={ [ item.type ] as Array<TransactionType> }
              />
              <TxStatus
                status={ item.status }
                errorText={ item.status === 'error' ? item.result : undefined }
              />
            </HStack>
            <TxAdditionalInfo isMobile hash={ item.hash }/>
          </Flex>
          <Flex
            justifyContent="space-between"
            lineHeight="24px"
            mt={ 3 }
            alignItems="center"
          >
            <Flex>
              <Icon as={ transactionIcon } boxSize="30px" color="link"/>
              <Address width="100%" ml={ 2 }>
                <AddressLink
                  hash={ item.hash }
                  type="transaction"
                  fontWeight="700"
                  truncation="constant"
                />
              </Address>
            </Flex>
          </Flex>
          <Box mt={ 2 }>
            <Skeleton isLoaded display="inline-block" whiteSpace="pre">
              Block{ ' ' }
            </Skeleton>
            <Skeleton isLoaded display="inline-block">
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
              />
              <CopyToClipboard text={ item.from_address_hash }/>
            </Address>
            <Box mx={ 2 }>
              <Icon as={ rightArrowIcon } boxSize={ 6 } color="gray.500"/>
            </Box>
            <Address>
              <AddressIcon
                address={{
                  hash: item.to_address_hash,
                  is_contract: false,
                  implementation_name: '',
                }}
              />
              <AddressLink
                type="address"
                hash={ item.to_address_hash }
                fontWeight="500"
                ml={ 2 }
                truncation="constant"
              />
              <CopyToClipboard text={ item.to_address_hash }/>
            </Address>
          </Flex>
          <Box mt={ 2 }>
            <Skeleton isLoaded display="inline-block" whiteSpace="pre">
              Value { config.chain.currency.symbol }{ ' ' }
            </Skeleton>
            <Skeleton isLoaded display="inline-block" variant="text_secondary">
              { getValueWithUnit(item.value).toFormat() }
            </Skeleton>
          </Box>
          <Box mt={ 2 } mb={ 3 }>
            <Skeleton isLoaded display="inline-block" whiteSpace="pre">
              Fee { config.chain.currency.symbol }{ ' ' }
            </Skeleton>
            <Skeleton isLoaded display="inline-block" variant="text_secondary">
              { getValueWithUnit(item.fee.value).toFormat() }
            </Skeleton>
          </Box>
        </ListItemMobile>
      )) }
    </>
  );
};

export default React.memo(AspectTxsList);
