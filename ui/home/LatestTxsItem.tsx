/* eslint-disable */

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

import config from 'configs/app';
import getValueWithUnit from 'lib/getValueWithUnit';
import { currencyUnits } from 'lib/units';
import AddressFromToCompact from 'ui/shared/address/AddressFromToCompact';
import * as TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TimeAgoWithTooltip from 'ui/shared/TimeAgoWithTooltip';
import TxFee from 'ui/shared/tx/TxFee';
import TxWatchListTags from 'ui/shared/tx/TxWatchListTags';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';
import TxType from 'ui/txs/TxType';

type Props = {
  tx: Transaction;
  isLoading?: boolean;
};


const txIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={20} viewBox="0 0 18 20" fill="none">
      <path d="M9 19L17 14.5V5.5L9 1L1 5.5V14.5L9 19ZM9 19V10.5625M9 10.5625L1.49445 6.0625M9 10.5625L16.5056 6.0625" stroke="#B0B0B0" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>

)

const getShortHash = (hash: string) => {
  if (!hash) return '';
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

const txhashStyle = {
    color: '#D940A4',
    fontFamily: 'Outfit',
    fontSize: '1.125rem',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: 'normal',
};

const timeagoStyle = {
  color: '#B0B0B0',
  fontFamily: 'Outfit',
  fontSize: '0.75rem',
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: 'normal',
};

const LatestTxsItem = ({ tx, isLoading }: Props) => {
  const dataTo = tx.to ? tx.to : tx.created_contract;
  const columnNum = config.UI.views.tx.hiddenFields?.value && config.UI.views.tx.hiddenFields?.tx_fee ? 2 : 3;

  return (
    <Grid
      gridTemplateColumns={{
        lg: columnNum === 2 ? '3fr minmax(auto, 180px)' : '3fr minmax(auto, 180px) 170px',
        xl: columnNum === 2 ? '3fr minmax(auto, 250px)' : '3fr minmax(auto, 275px) 170px',
      }}
      gridGap={ 8 }
      width="100%"
      minW="700px"
      borderTop="1px solid"
      borderColor="divider"
      p={ 4 }
      _last={{ borderBottom: '1px solid', borderColor: 'divider' }}
      display={{ base: 'none', lg: 'grid' }}
    >
      <Flex overflow="hidden" w="100%">
        <TxAdditionalInfo tx={ tx } isLoading={ isLoading } my="3px"/>
        <Box ml={ 3 } w="calc(100% - 40px)">
          <HStack flexWrap="wrap" my="3px">
            <TxType types={ tx.transaction_types } isLoading={ isLoading }/>
            <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/>
            <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
          </HStack>
          <Flex
            alignItems="center"
            mt="7px"
            mb="3px"
          >
            {/* <TxEntity
              isLoading={ isLoading }
              hash={  }
              
              fontWeight={ 600 }
              color="#D940A4"
              fontSize="1.125rem"
              fontFamily="Outfit"
              fontStyle="normal"
              lineHeight="normal"
              noIcon = { true}
            /> */}
            <TxEntity.Container>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '1.5rem',
                height: '1.5rem',
                marginRight: '0.56rem',
              }}>
                { txIcon }
              </span>
              <TxEntity.Link
                isLoading={ isLoading }
                hash={ tx.hash}
              >
                <TxEntity.Content
                  hash={ tx.hash}
                  text={ getShortHash(tx.hash) }
                  { ...txhashStyle }
                />
              </TxEntity.Link>
            </TxEntity.Container>
            <TimeAgoWithTooltip
              timestamp={ tx.timestamp }
              enableIncrement
              isLoading={ isLoading }
              { ...timeagoStyle }
              flexShrink={ 0 }
              ml={ 2 }
            />
          </Flex>
        </Box>
      </Flex>
      <AddressFromToCompact
        from={ tx.from }
        to={ dataTo }
        noIcon = { true }
        isLoading={ isLoading }
      />
      <Flex flexDir="column" gap="0.44rem">
        { !config.UI.views.tx.hiddenFields?.value && (
          <Skeleton isLoaded={ !isLoading }>
            <Text as="span" whiteSpace="pre" className="latest-tx-item-value-label">Value </Text>
            <Text as="span" variant="secondary" className="latest-tx-item-value-value">{ getValueWithUnit(tx.value).dp(5).toFormat() } { currencyUnits.ether }</Text>
          </Skeleton>
        ) }
        { !config.UI.views.tx.hiddenFields?.tx_fee && (
          <Skeleton isLoaded={ !isLoading } display="flex" whiteSpace="pre">
            <Text as="span"  className="latest-tx-item-fee-label">Fee </Text>
            <TxFee tx={ tx } accuracy={ 5 } className="latest-tx-item-fee-value" color="text_secondary"/>
          </Skeleton>
        ) }
      </Flex>
    </Grid>
  );
};

export default React.memo(LatestTxsItem);
