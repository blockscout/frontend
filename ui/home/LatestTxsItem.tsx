import {
  Box,
  Flex,
  HStack,
  Icon,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import appConfig from 'configs/app/config';
import rightArrowIcon from 'icons/arrows/east.svg';
import transactionIcon from 'icons/transactions.svg';
import getValueWithUnit from 'lib/getValueWithUnit';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import TxStatus from 'ui/shared/TxStatus';
import TxType from 'ui/txs/TxType';

type Props = {
  tx: Transaction;
}

const LatestBlocksItem = ({ tx }: Props) => {
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const iconColor = useColorModeValue('blue.600', 'blue.300');

  const dataTo = tx.to && tx.to.hash ? tx.to : tx.created_contract;
  const timeAgo = useTimeAgoIncrement(tx.timestamp || '0', true);

  return (
    <Box
      width="100%"
      borderTop="1px solid"
      borderColor={ borderColor }
      py={{ base: 4, lg: 6 }}
      px={{ base: 0, lg: 4 }}
      _last={{ borderBottom: '1px solid', borderColor }}
    >
      <Flex justifyContent="space-between" width="100%" alignItems="start" flexDirection={{ base: 'column', lg: 'row' }}>
        <Box width="100%">
          <HStack>
            { /* FIXME: mb only one type must be here */ }
            <TxType type={ tx.tx_types[0] }/>
            { /* { tx.tx_types.map(item => <TxType key={ item } type={ item }/>) } */ }
            <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined }/>
          </HStack>
          <Flex
            mt={ 2 }
            alignItems="center"
            width="100%"
            justifyContent={{ base: 'space-between', lg: 'start' }}
            mb={{ base: 6, lg: 0 }}
          >
            <Flex mr={ 3 }>
              <Icon
                as={ transactionIcon }
                boxSize="30px"
                mr={ 2 }
                color={ iconColor }
              />
              <Address width="100%">
                <AddressLink
                  hash={ tx.hash }
                  type="transaction"
                  fontWeight="700"
                  truncation="constant"
                  target="_self"
                />
              </Address>
            </Flex>
            { tx.timestamp && <Text variant="secondary" fontWeight="400" fontSize="sm">{ timeAgo }</Text> }
          </Flex>
        </Box>
        <Box>
          <Flex alignItems="center" mb={ 3 }>
            <Address>
              <AddressIcon hash={ tx.from.hash }/>
              <AddressLink
                hash={ tx.from.hash }
                alias={ tx.from.name }
                fontWeight="500"
                ml={ 2 }
                truncation="constant"
                fontSize="sm"
              />
            </Address>
            <Icon
              as={ rightArrowIcon }
              boxSize={ 6 }
              mx={ 2 }
              color="gray.500"
            />
            <Address>
              <AddressIcon hash={ dataTo.hash }/>
              <AddressLink
                hash={ dataTo.hash }
                alias={ dataTo.name }
                fontWeight="500"
                ml={ 2 }
                truncation="constant"
                fontSize="sm"
              />
            </Address>
          </Flex>
          <Flex fontSize="sm" mt={ 3 } justifyContent="end" flexDirection={{ base: 'column', lg: 'row' }}>
            <Box mr={{ base: 0, lg: 2 }} mb={{ base: 2, lg: 0 }}>
              <Text as="span">Value { appConfig.network.currency.symbol } </Text>
              <Text as="span" variant="secondary">{ getValueWithUnit(tx.value).toFormat() }</Text>
            </Box>
            <Box>
              <Text as="span">Fee { appConfig.network.currency.symbol } </Text>
              <Text as="span" variant="secondary">{ getValueWithUnit(tx.fee.value).toFormat() }</Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default LatestBlocksItem;
