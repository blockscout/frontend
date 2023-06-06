import {
  Box,
  Flex,
  HStack,
  Text,
  Skeleton,
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
import Icon from 'ui/shared/chakra/Icon';
import TxStatus from 'ui/shared/TxStatus';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';
import TxType from 'ui/txs/TxType';

type Props = {
  tx: Transaction;
  isLoading?: boolean;
}

const LatestTxsItem = ({ tx, isLoading }: Props) => {
  const dataTo = tx.to ? tx.to : tx.created_contract;
  const timeAgo = useTimeAgoIncrement(tx.timestamp || '0', true);

  return (
    <Box
      width="100%"
      borderTop="1px solid"
      borderColor="divider"
      py={ 4 }
      _last={{ borderBottom: '1px solid', borderColor: 'divider' }}
      display={{ base: 'block', lg: 'none' }}
    >
      <Flex justifyContent="space-between">
        <HStack>
          <TxType types={ tx.tx_types } isLoading={ isLoading }/>
          <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/>
        </HStack>
        <TxAdditionalInfo tx={ tx } isMobile isLoading={ isLoading }/>
      </Flex>
      <Flex
        mt={ 2 }
        alignItems="center"
        width="100%"
        justifyContent="space-between"
        mb={ 6 }
      >
        <Flex mr={ 3 }>
          <Icon
            as={ transactionIcon }
            boxSize="30px"
            mr={ 2 }
            color="link"
            isLoading={ isLoading }
          />
          <Address width="100%">
            <AddressLink
              hash={ tx.hash }
              type="transaction"
              fontWeight="700"
              truncation="constant"
              isLoading={ isLoading }
            />
          </Address>
        </Flex>
        { tx.timestamp && (
          <Skeleton isLoaded={ !isLoading } color="text_secondary" fontWeight="400" fontSize="sm">
            <span>{ timeAgo }</span>
          </Skeleton>
        ) }
      </Flex>
      <Flex alignItems="center" mb={ 3 }>
        <Address mr={ 2 }>
          <AddressIcon address={ tx.from } isLoading={ isLoading }/>
          <AddressLink
            type="address"
            hash={ tx.from.hash }
            alias={ tx.from.name }
            fontWeight="500"
            ml={ 2 }
            truncation="constant"
            fontSize="sm"
            isLoading={ isLoading }
          />
        </Address>
        <Icon
          as={ rightArrowIcon }
          boxSize={ 6 }
          color="gray.500"
          isLoading={ isLoading }
        />
        { dataTo && (
          <Address ml={ 2 }>
            <AddressIcon address={ dataTo } isLoading={ isLoading }/>
            <AddressLink
              type="address"
              hash={ dataTo.hash }
              alias={ dataTo.name }
              fontWeight="500"
              ml={ 2 }
              truncation="constant"
              fontSize="sm"
              isLoading={ isLoading }
            />
          </Address>
        ) }
      </Flex>
      <Skeleton isLoaded={ !isLoading } mb={ 2 } fontSize="sm" w="fit-content">
        <Text as="span">Value { appConfig.network.currency.symbol } </Text>
        <Text as="span" variant="secondary">{ getValueWithUnit(tx.value).dp(5).toFormat() }</Text>
      </Skeleton>
      <Skeleton isLoaded={ !isLoading } fontSize="sm" w="fit-content">
        <Text as="span">Fee { appConfig.network.currency.symbol } </Text>
        <Text as="span" variant="secondary">{ getValueWithUnit(tx.fee.value).dp(5).toFormat() }</Text>
      </Skeleton>
    </Box>
  );
};

export default React.memo(LatestTxsItem);
