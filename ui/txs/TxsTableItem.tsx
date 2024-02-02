import {
  Tr,
  Td,
  VStack,
  Show,
  Hide,
  Flex,
  Skeleton,
  Box,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import Tag from 'ui/shared/chakra/Tag';
import CurrencyValue from 'ui/shared/CurrencyValue';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import IconSvg from 'ui/shared/IconSvg';
import InOutTag from 'ui/shared/InOutTag';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TxFeeStability from 'ui/shared/tx/TxFeeStability';
import TxWatchListTags from 'ui/shared/tx/TxWatchListTags';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';

import type { TransactionWithTranslate } from './noves/useDescribeTxs';
import TxType from './TxType';

type Props = {
  tx: TransactionWithTranslate;
  showBlockInfo: boolean;
  currentAddress?: string;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
  // "translateEnabled" removed and replaced with "tx.translate.enabled"
}

const TxsTableItem = ({ tx, showBlockInfo, currentAddress, enableTimeIncrement, isLoading }: Props) => {
  const dataTo = tx.to ? tx.to : tx.created_contract;
  const isOut = Boolean(currentAddress && currentAddress === tx.from.hash);
  const isIn = Boolean(currentAddress && currentAddress === dataTo?.hash);

  const timeAgo = useTimeAgoIncrement(tx.timestamp, enableTimeIncrement);

  // This will be removed once the new proxy is ready
  const { data: describeData, isLoading: isDescribeLoading } = useApiQuery('noves_describe_tx', {
    pathParams: { hash: tx.hash },
    queryOptions: {
      enabled: tx.translate.enabled,
    },
  });
  //

  const addressFrom = (
    <AddressEntity
      address={ tx.from }
      isLoading={ isLoading }
      noCopy={ isOut }
      noLink={ isOut }
      truncation="constant"
      w="100%"
      py="2px"
    />
  );

  const addressTo = dataTo ? (
    <AddressEntity
      address={ dataTo }
      isLoading={ isLoading }
      truncation="constant"
      noCopy={ isIn }
      noLink={ isIn }
      w="100%"
      py="2px"
    />
  ) : '-';

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
            fontWeight={ 700 }
            noIcon
            maxW="100%"
          />
          { tx.timestamp && <Skeleton color="text_secondary" fontWeight="400" isLoaded={ !isLoading }><span>{ timeAgo }</span></Skeleton> }
        </VStack>
      </Td>
      <Td>
        <VStack alignItems="start">
          {

            /* Whit the data inside tx
              <TxType types={ tx.tx_types } isLoading={ isLoading || tx.translate.isLoading } translateLabel={ tx.translate.type }/>
            */
          }
          <TxType types={ tx.tx_types } isLoading={ isLoading || isDescribeLoading } translateLabel={ describeData?.type }/>
          <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } isLoading={ isLoading }/>
          <TxWatchListTags tx={ tx } isLoading={ isLoading }/>
        </VStack>
      </Td>
      <Td whiteSpace="nowrap">
        { tx.method && (
          <Tag colorScheme={ tx.method === 'Multicall' ? 'teal' : 'gray' } isLoading={ isLoading } isTruncated>
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
      <Show above="xl" ssr={ false }>
        <Td>
          { addressFrom }
        </Td>
        <Td px={ 0 }>
          { (isIn || isOut) ?
            <InOutTag isIn={ isIn } isOut={ isOut } width="48px" mr={ 2 } isLoading={ isLoading }/> : (
              <Box mx="6px">
                <IconSvg name="arrows/east" boxSize={ 6 } color="gray.500" isLoading={ isLoading }/>
              </Box>
            ) }
        </Td>
        <Td>
          { addressTo }
        </Td>
      </Show>
      <Hide above="xl" ssr={ false }>
        <Td colSpan={ 3 }>
          <Flex alignItems="center">
            { (isIn || isOut) ?
              <InOutTag isIn={ isIn } isOut={ isOut } width="48px" isLoading={ isLoading }/> : (
                <IconSvg
                  name="arrows/east"
                  boxSize={ 6 }
                  color="gray.500"
                  transform="rotate(90deg)"
                  isLoading={ isLoading }
                />
              ) }
            <VStack alignItems="start" overflow="hidden" ml={ 1 }>
              { addressFrom }
              { addressTo }
            </VStack>
          </Flex>
        </Td>
      </Hide>
      { !config.UI.views.tx.hiddenFields?.value && (
        <Td isNumeric>
          <CurrencyValue value={ tx.value } accuracy={ 8 } isLoading={ isLoading }/>
        </Td>
      ) }
      { !config.UI.views.tx.hiddenFields?.tx_fee && (
        <Td isNumeric>
          { /* eslint-disable-next-line no-nested-ternary */ }
          { tx.stability_fee ? (
            <TxFeeStability data={ tx.stability_fee } isLoading={ isLoading } accuracy={ 8 } justifyContent="end" hideUsd/>
          ) : (
            tx.fee.value ? <CurrencyValue value={ tx.fee.value } accuracy={ 8 } isLoading={ isLoading }/> : '-'
          ) }
        </Td>
      ) }
    </Tr>
  );
};

export default React.memo(TxsTableItem);
