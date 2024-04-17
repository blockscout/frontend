/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Tr,
  Td,
  VStack,
  Skeleton,
  useColorModeValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';

import config from 'configs/app';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import AddressFrom from 'ui/shared/address/AddressFrom';
import AddressTo from 'ui/shared/address/AddressTo';
import Tag from 'ui/shared/chakra/Tag';
import CurrencyValue from 'ui/shared/CurrencyValue';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TxFeeStability from 'ui/shared/tx/TxFeeStability';
import TxWatchListTags from 'ui/shared/tx/TxWatchListTags';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';

import TxTranslationType from './TxTranslationType';
// import TxType from './TxType';

type Props = {
  tx: any;
  showBlockInfo: boolean;
  currentAddress?: string;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
}

const TxsTableItem = ({ tx, showBlockInfo, enableTimeIncrement, isLoading }: Props) => {
  const dataTo = tx.to ? tx.to : tx.created_contract;
  const timeAgo = useTimeAgoIncrement(tx.timestamp, enableTimeIncrement);
  const color = useColorModeValue('rgba(33, 37, 41, 1)', 'gray.1300');
  const tagBg = useColorModeValue('rgba(248, 249, 250, 1)', 'blue.1000');
  const tagColor = useColorModeValue('rgba(0, 0, 0, 1)', 'gray.1300');
  const tagBorderColor = useColorModeValue('rgba(0, 0, 0, 0.1)', 'gray.1400');

  return (
    <Tr
      as={ motion.tr }
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transitionDuration="normal"
      transitionTimingFunction="linear"
      key={ tx.hash }
    >
      <Td pl={ 4 }>
        <TxAdditionalInfo tx={ tx } isLoading={ isLoading }/>
      </Td>
      <Td pr={ 4 }>
        <VStack alignItems="start" lineHeight="24px">
          <TxEntity
            hash={ tx.hash }
            isLoading={ isLoading }
            noIcon
            maxW="100%"
            truncation="constant_long"
          />
          { tx.timestamp && (
            <Skeleton fontWeight="500" color={ color } isLoaded={ !isLoading }>
              <span>{ timeAgo }</span>
            </Skeleton>
          ) }
        </VStack>
      </Td>
      <Td>
        <VStack alignItems="start">
          { tx.translation ? (
            <TxTranslationType
              types={ tx.tx_types }
              isLoading={ isLoading || tx.translation.isLoading }
              translatationType={ tx.translation.data?.type }
            />
          ) : (
          // { tx.translation ? (
          //   <TxTranslationType
          //     types={ tx.tx_types }
          //     isLoading={ isLoading || tx.translation.isLoading }
          //     translatationType={ tx.translation.data?.type }
          //   />
          // ) : (
          //   <TxType types={ tx.tx_types } isLoading={ isLoading }/>
          // ) }
            <TxStatus
              status={ tx.status }
              errorText={ tx.status === 'error' ? tx.result : undefined }
              isLoading={ isLoading }
            />
          ) }
          <TxStatus
            status={ tx.status }
            errorText={ tx.status === 'error' ? tx.result : undefined }
            isLoading={ isLoading }
          />
          <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
        </VStack>
      </Td>
      <Td whiteSpace="nowrap">
        { tx.method && (
          <Tag
            color={ tagColor }
            fontWeight={ 500 }
            fontSize="13px"
            padding="4px 16px"
            isLoading={ isLoading }
            isTruncated
            border="1px"
            borderColor={ tagBorderColor }
            backgroundColor={ tagBg }
          >
            { tx.method }
          </Tag>
        ) }
      </Td>
      { showBlockInfo && (
        <Td>
          { tx.block && (
            <BlockEntity
              isLoading={ isLoading }
              number={ tx.block }
              noIcon
              fontSize="sm"
              lineHeight={ 6 }
              fontWeight={ 500 }
            />
          ) }
        </Td>
      ) }
      <Td>
        <AddressFrom from={ tx.from } isLoading={ isLoading } mt="2px"/>
      </Td>
      <Td>
        <AddressTo to={ dataTo } isLoading={ isLoading } mt="2px"/>
      </Td>
      { !config.UI.views.tx.hiddenFields?.value && (
        <Td isNumeric>
          <CurrencyValue value={ tx.value } accuracy={ 8 } isLoading={ isLoading }/>
        </Td>
      ) }
      { !config.UI.views.tx.hiddenFields?.tx_fee && (
        <Td isNumeric>
          { /* eslint-disable-next-line no-nested-ternary */ }
          { tx.stability_fee ? (
            <TxFeeStability
              data={ tx.stability_fee }
              isLoading={ isLoading }
              accuracy={ 8 }
              justifyContent="end"
              hideUsd
            />
          ) : tx.fee.value ? (
            <CurrencyValue
              value={ tx.fee.value }
              accuracy={ 8 }
              isLoading={ isLoading }
            />
          ) : (
            '-'
          ) }
        </Td>
      ) }
    </Tr>
  );
};

export default React.memo(TxsTableItem);
