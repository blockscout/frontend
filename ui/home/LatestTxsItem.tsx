import {
  Box,
  Flex,
  HStack,
  Icon,
  Text,
} from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import appConfig from 'configs/app/config';
import rightArrowIcon from 'icons/arrows/east.svg';
import transactionIcon from 'icons/transactions.svg';
import getValueWithUnit from 'lib/getValueWithUnit';
import useIsMobile from 'lib/hooks/useIsMobile';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import Address from 'ui/shared/address/Address';
import AddressIcon from 'ui/shared/address/AddressIcon';
import AddressLink from 'ui/shared/address/AddressLink';
import TxStatus from 'ui/shared/TxStatus';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';
import TxType from 'ui/txs/TxType';

type Props = {
  tx: Transaction;
}

const LatestTxsItem = ({ tx }: Props) => {
  const dataTo = tx.to ? tx.to : tx.created_contract;
  const timeAgo = useTimeAgoIncrement(tx.timestamp || '0', true);

  const isMobile = useIsMobile();

  return (
    <Box
      width="100%"
      borderTop="1px solid"
      borderColor="divider"
      py={ 4 }
      px={{ base: 0, lg: 4 }}
      _last={{ borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Flex justifyContent="space-between" width="100%" alignItems="start" flexDirection={{ base: 'column', lg: 'row' }}>
        { !isMobile && <Flex mr={ 3 }><TxAdditionalInfo tx={ tx }/></Flex> }
        <Box width={{ base: '100%', lg: 'calc(50% - 32px)' }}>
          <Flex justifyContent="space-between">
            <HStack>
              <TxType types={ tx.tx_types }/>
              <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined }/>
            </HStack>
            { isMobile && <TxAdditionalInfo tx={ tx } isMobile/> }
          </Flex>
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
                color="link"
              />
              <Address width="100%">
                <AddressLink
                  hash={ tx.hash }
                  type="transaction"
                  fontWeight="700"
                  truncation="constant"
                />
              </Address>
            </Flex>
            { tx.timestamp && <Text variant="secondary" fontWeight="400" fontSize="sm">{ timeAgo }</Text> }
          </Flex>
        </Box>
        <Box width={{ base: '100%', lg: '50%' }}>
          <Flex alignItems="center" mb={ 3 } justifyContent={{ base: 'start', lg: 'end' }}>
            <Address>
              <AddressIcon address={ tx.from }/>
              <AddressLink
                type="address"
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
            { dataTo && (
              <Address>
                <AddressIcon address={ dataTo }/>
                <AddressLink
                  type="address"
                  hash={ dataTo.hash }
                  alias={ dataTo.name }
                  fontWeight="500"
                  ml={ 2 }
                  truncation="constant"
                  fontSize="sm"
                />
              </Address>
            ) }
          </Flex>
          <Flex fontSize="sm" justifyContent="end" flexDirection={{ base: 'column', lg: 'row' }}>
            <Box mr={{ base: 0, lg: 3 }} mb={{ base: 2, lg: 0 }}>
              <Text as="span">Value { appConfig.network.currency.symbol } </Text>
              <Text as="span" variant="secondary">{ getValueWithUnit(tx.value).dp(5).toFormat() }</Text>
            </Box>
            <Box>
              <Text as="span">Fee { appConfig.network.currency.symbol } </Text>
              <Text as="span" variant="secondary">{ getValueWithUnit(tx.fee.value).dp(5).toFormat() }</Text>
            </Box>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default React.memo(LatestTxsItem);
