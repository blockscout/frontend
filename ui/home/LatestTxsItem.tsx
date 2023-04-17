import {
  Box,
  Flex,
  HStack,
  Icon,
  Text,
  Grid,
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

  if (isMobile) {
    return (
      <Box
        width="100%"
        borderTop="1px solid"
        borderColor="divider"
        py={ 4 }
        _last={{ borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Flex justifyContent="space-between">
          <HStack>
            <TxType types={ tx.tx_types }/>
            <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined }/>
          </HStack>
          <TxAdditionalInfo tx={ tx } isMobile/>
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
        <Flex alignItems="center" mb={ 3 }>
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
        <Box mb={ 2 } fontSize="sm">
          <Text as="span">Value { appConfig.network.currency.symbol } </Text>
          <Text as="span" variant="secondary">{ getValueWithUnit(tx.value).dp(5).toFormat() }</Text>
        </Box>
        <Box fontSize="sm">
          <Text as="span">Fee { appConfig.network.currency.symbol } </Text>
          <Text as="span" variant="secondary">{ getValueWithUnit(tx.fee.value).dp(5).toFormat() }</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      width="100%"
      minW="700px"
      borderTop="1px solid"
      borderColor="divider"
      p={ 4 }
      _last={{ borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Grid width="100%" gridTemplateColumns="3fr 2fr 150px" gridGap={ 8 }>
        <Flex overflow="hidden" w="100%">
          <TxAdditionalInfo tx={ tx }/>
          <Box ml={ 3 } w="calc(100% - 40px)">
            <HStack>
              <TxType types={ tx.tx_types }/>
              <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined }/>
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
                mr={ 2 }
              />
              <Address overflow="hidden" w="calc(100% - 130px)" maxW="calc(100% - 130px)" mr={ 2 }>
                <AddressLink
                  hash={ tx.hash }
                  type="transaction"
                  fontWeight="700"
                />
              </Address>
              { tx.timestamp && <Text variant="secondary" fontWeight="400" fontSize="sm">{ timeAgo }</Text> }
            </Flex>
          </Box>
        </Flex>
        <Grid alignItems="center" templateColumns="24px auto">
          <Icon
            as={ rightArrowIcon }
            boxSize={ 6 }
            color="gray.500"
            transform="rotate(90deg)"
          />
          <Box overflow="hidden" ml={ 1 }>
            <Address mb={ 2 }>
              <AddressIcon address={ tx.from }/>
              <AddressLink
                type="address"
                hash={ tx.from.hash }
                alias={ tx.from.name }
                fontWeight="500"
                ml={ 2 }
                fontSize="sm"
              />
            </Address>
            { dataTo && (
              <Address>
                <AddressIcon address={ dataTo }/>
                <AddressLink
                  type="address"
                  hash={ dataTo.hash }
                  alias={ dataTo.name }
                  fontWeight="500"
                  ml={ 2 }
                  fontSize="sm"
                />
              </Address>
            ) }
          </Box>
        </Grid>
        <Box>
          <Box mb={ 2 }>
            <Text as="span" whiteSpace="pre">{ appConfig.network.currency.symbol } </Text>
            <Text as="span" variant="secondary">{ getValueWithUnit(tx.value).dp(5).toFormat() }</Text>
          </Box>
          <Box>
            <Text as="span">Fee </Text>
            <Text as="span" variant="secondary">{ getValueWithUnit(tx.fee.value).dp(5).toFormat() }</Text>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default React.memo(LatestTxsItem);
