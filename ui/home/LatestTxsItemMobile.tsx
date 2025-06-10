/* eslint-disable */


import {
  Box,
  Flex,
  HStack,
  Text,
  Skeleton,
} from '@chakra-ui/react';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import config from 'configs/app';
import getValueWithUnit from 'lib/getValueWithUnit';
import { currencyUnits } from 'lib/units';
import AddressFromTo from 'ui/shared/address/AddressFromTo';
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
        <HStack flexWrap="wrap">
          <TxType types={ tx.transaction_types } isLoading={ isLoading }/>
          <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/>
          <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
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
                truncation="constant_long"
                text={ getShortHash(tx.hash) }
                { ...txhashStyle }
              />
            </TxEntity.Link>
          </TxEntity.Container>
        <TimeAgoWithTooltip
          timestamp={ tx.timestamp }
          enableIncrement
          isLoading={ isLoading }
          color="text_secondary"
          fontWeight="400"
          fontSize="sm"
          ml={ 3 }
        />
      </Flex>
      <AddressFromTo
        from={ tx.from }
        to={ dataTo }
        isLoading={ isLoading }
        noIcon={ true }
        mb={ 3 }
        { ...timeagoStyle }
      />
      { !config.UI.views.tx.hiddenFields?.value && (
        <Skeleton isLoaded={ !isLoading } mb={ 2 } fontSize="sm" w="fit-content">
          <Text as="span">Value </Text>
          <Text as="span" variant="secondary">{ getValueWithUnit(tx.value).dp(5).toFormat() } { currencyUnits.ether }</Text>
        </Skeleton>
      ) }
      { !config.UI.views.tx.hiddenFields?.tx_fee && (
        <Skeleton isLoaded={ !isLoading } fontSize="sm" w="fit-content" display="flex" whiteSpace="pre">
          <Text as="span">Fee </Text>
          <TxFee tx={ tx } accuracy={ 5 } color="text_secondary"/>
        </Skeleton>
      ) }
    </Box>
  );
};

export default React.memo(LatestTxsItem);
