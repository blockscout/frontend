import {
  Box,
  Flex,
  HStack,
  Text,
  Grid,
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
      minW="700px"
      borderTop="1px solid"
      borderColor="divider"
      p={ 4 }
      _last={{ borderBottom: '1px solid', borderColor: 'divider' }}
      display={{ base: 'none', lg: 'block' }}
    >
      <Grid width="100%" gridTemplateColumns="3fr 2fr 150px" gridGap={ 8 }>
        <Flex overflow="hidden" w="100%">
          <TxAdditionalInfo tx={ tx } isLoading={ isLoading }/>
          <Box ml={ 3 } w="calc(100% - 40px)">
            <HStack>
              <TxType types={ tx.tx_types } isLoading={ isLoading }/>
              <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/>
            </HStack>
            <Flex
              mt={ 2 }
              alignItems="center"
            >
              <Icon
                as={ transactionIcon }
                boxSize="30px"
                color="link"
                display="inline"
                isLoading={ isLoading }
                borderRadius="base"
              />
              <Address overflow="hidden" w="calc(100% - 130px)" maxW="calc(100% - 130px)" ml={ 2 } mr={ 2 }>
                <AddressLink
                  hash={ tx.hash }
                  type="transaction"
                  fontWeight="700"
                  isLoading={ isLoading }
                />
              </Address>
              { tx.timestamp && (
                <Skeleton isLoaded={ !isLoading } color="text_secondary" fontWeight="400" fontSize="sm">
                  <span>{ timeAgo }</span>
                </Skeleton>
              ) }
            </Flex>
          </Box>
        </Flex>
        <Grid alignItems="center" templateColumns="24px auto">
          <Icon
            as={ rightArrowIcon }
            boxSize={ 6 }
            color="gray.500"
            transform="rotate(90deg)"
            isLoading={ isLoading }
          />
          <Box overflow="hidden" ml={ 1 }>
            <Address mb={ 2 }>
              <AddressIcon address={ tx.from } isLoading={ isLoading }/>
              <AddressLink
                type="address"
                hash={ tx.from.hash }
                alias={ tx.from.name }
                fontWeight="500"
                ml={ 2 }
                fontSize="sm"
                isLoading={ isLoading }
              />
            </Address>
            { dataTo && (
              <Address>
                <AddressIcon address={ dataTo } isLoading={ isLoading }/>
                <AddressLink
                  type="address"
                  hash={ dataTo.hash }
                  alias={ dataTo.name }
                  fontWeight="500"
                  ml={ 2 }
                  fontSize="sm"
                  isLoading={ isLoading }
                />
              </Address>
            ) }
          </Box>
        </Grid>
        <Box>
          <Skeleton isLoaded={ !isLoading } mb={ 2 }>
            <Text as="span" whiteSpace="pre">{ appConfig.network.currency.symbol } </Text>
            <Text as="span" variant="secondary">{ getValueWithUnit(tx.value).dp(5).toFormat() }</Text>
          </Skeleton>
          <Skeleton isLoaded={ !isLoading }>
            <Text as="span">Fee </Text>
            <Text as="span" variant="secondary">{ getValueWithUnit(tx.fee.value).dp(5).toFormat() }</Text>
          </Skeleton>
        </Box>
      </Grid>
    </Box>
  );
};

export default React.memo(LatestTxsItem);
