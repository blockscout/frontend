import { Box, Flex, VStack, Separator, HStack, chakra } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import { route } from 'nextjs/routes';

import config from 'configs/app';
import { useMultichainContext } from 'lib/contexts/multichain';
import { currencyUnits } from 'lib/units';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import BlobEntity from 'ui/shared/entities/blob/BlobEntity';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TextSeparator from 'ui/shared/TextSeparator';
import TxFee from 'ui/shared/tx/TxFee';
import Utilization from 'ui/shared/Utilization/Utilization';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

const TxAdditionalInfoContent = ({ tx, isLoading }: { tx: Transaction; isLoading?: boolean }) => {
  const multichainContext = useMultichainContext();

  const sectionTitleProps = {
    color: 'text.secondary',
    fontWeight: 600,
    marginBottom: 1,
  };

  return (
    <>
      <TxStatus
        status={ tx.status }
        errorText={ tx.status === 'error' ? tx.result : undefined }
        mb={ 3 }
        isLoading={ isLoading }
      />
      <VStack
        alignItems="stretch"
        separator={ <Separator orientation="horizontal"/> }
        gap={ 3 }
      >
        { tx.blob_versioned_hashes && tx.blob_versioned_hashes.length > 0 && (
          <Box>
            <VStack alignItems="stretch" gap={ 1 }>
              <Flex alignItems="center" justifyContent="space-between">
                <Skeleton loading={ isLoading } { ...sectionTitleProps }>Blobs: { tx.blob_versioned_hashes.length }</Skeleton>
                { tx.blob_versioned_hashes.length > 3 && (
                  <Link
                    href={ route({ pathname: '/tx/[hash]', query: { hash: tx.hash, tab: 'blobs' } }) }
                    loading={ isLoading }
                    variant="secondary"
                  >
                    view all
                  </Link>
                ) }
              </Flex>
              <VStack alignItems="stretch" gap={ 1 }>
                { tx.blob_versioned_hashes.slice(0, 3).map((hash, index) => (
                  <Flex key={ hash } columnGap={ 2 } py={ 0.5 } w="full">
                    <Skeleton loading={ isLoading } fontWeight={ 500 }>{ index + 1 }</Skeleton>
                    <BlobEntity hash={ hash } noIcon isLoading={ isLoading }/>
                  </Flex>
                )) }
              </VStack>
            </VStack>
          </Box>
        ) }

        <VStack alignItems="stretch" gap={ 1 }>
          <Skeleton loading={ isLoading } { ...sectionTitleProps }>
            <span>Value</span>
          </Skeleton>
          <NativeCoinValue
            amount={ tx.value }
            exchangeRate={ tx.exchange_rate }
            historicalExchangeRate={ tx.historic_exchange_rate }
            noTooltip
            loading={ isLoading }
          />
        </VStack>

        { !config.UI.views.tx.hiddenFields?.tx_fee && (tx.stability_fee !== undefined || tx.fee.value !== null) && (
          <VStack alignItems="stretch" gap={ 1 }>
            <Skeleton loading={ isLoading } { ...sectionTitleProps }>
              <span>Transaction fee</span>
            </Skeleton>
            <TxFee tx={ tx } rowGap={ 0 } noTooltip loading={ isLoading }/>
          </VStack>
        ) }

        { tx.gas_used !== null && (
          <VStack alignItems="stretch" gap={ 1 }>
            <Skeleton loading={ isLoading } { ...sectionTitleProps }>
              <span>Gas limit & usage by transaction</span>
            </Skeleton>
            <Flex>
              <Skeleton loading={ isLoading }>{ BigNumber(tx.gas_used).toFormat() }</Skeleton>
              <TextSeparator/>
              <Skeleton loading={ isLoading }>{ BigNumber(tx.gas_limit).toFormat() }</Skeleton>
              <Utilization ml={ 4 } value={ Number(BigNumber(tx.gas_used).dividedBy(BigNumber(tx.gas_limit)).toFixed(2)) } isLoading={ isLoading }/>
            </Flex>
          </VStack>
        ) }

        { !config.UI.views.tx.hiddenFields?.gas_fees &&
          (tx.base_fee_per_gas !== null || tx.max_fee_per_gas !== null || tx.max_priority_fee_per_gas !== null) && (
          <VStack alignItems="stretch" gap={ 1 }>
            <Skeleton loading={ isLoading } { ...sectionTitleProps }>
              <span>Gas fees ({ currencyUnits.gwei })</span>
            </Skeleton>
            <VStack gap={ 0 } alignItems="flex-start">
              { tx.base_fee_per_gas !== null && (
                <HStack gap={ 1 }>
                  <Skeleton loading={ isLoading }><span>Base:</span></Skeleton>
                  <NativeCoinValue
                    amount={ tx.base_fee_per_gas }
                    units="gwei"
                    unitsTooltip="wei"
                    noSymbol
                    fontWeight="700"
                    loading={ isLoading }
                  />
                </HStack>
              ) }
              { tx.max_fee_per_gas !== null && (
                <HStack gap={ 1 }>
                  <Skeleton loading={ isLoading }><span>Max:</span></Skeleton>
                  <NativeCoinValue
                    amount={ tx.max_fee_per_gas }
                    units="gwei"
                    unitsTooltip="wei"
                    noSymbol
                    fontWeight="700"
                    loading={ isLoading }
                  />
                </HStack>
              ) }
              { tx.max_priority_fee_per_gas !== null && (
                <HStack gap={ 1 }>
                  <Skeleton loading={ isLoading }><span>Max priority:</span></Skeleton>
                  <NativeCoinValue
                    amount={ tx.max_priority_fee_per_gas }
                    units="gwei"
                    unitsTooltip="wei"
                    noSymbol
                    fontWeight="700"
                    loading={ isLoading }
                  />
                </HStack>
              ) }
            </VStack>
          </VStack>
        ) }
        { !(tx.blob_versioned_hashes && tx.blob_versioned_hashes.length > 0) && (
          <VStack alignItems="stretch" gap={ 1 }>
            <Skeleton loading={ isLoading } { ...sectionTitleProps }>
              <span>Others</span>
            </Skeleton>
            <VStack alignItems="flex-start" gap={ 0 }>
              <Skeleton loading={ isLoading } display="flex" alignItems="center" gap={ 1 }>
                <span>Txn type: </span>
                <chakra.span fontWeight="700">{ tx.type }</chakra.span>
                { tx.type === 2 && <chakra.span color="text.secondary"><span>(EIP-1559)</span></chakra.span> }
              </Skeleton>
              <Skeleton loading={ isLoading } display="flex" alignItems="center" gap={ 1 }>
                <span>Nonce:</span>
                <chakra.span fontWeight="700">{ tx.nonce }</chakra.span>
              </Skeleton>
              <Skeleton loading={ isLoading } display="flex" alignItems="center" gap={ 1 }>
                <span>Position:</span>
                <chakra.span fontWeight="700">{ tx.position }</chakra.span>
              </Skeleton>
            </VStack>
          </VStack>
        ) }
        <Link
          href={ route({ pathname: '/tx/[hash]', query: { hash: tx.hash } }, multichainContext) }
          loading={ isLoading }
          mt={ 1 }
          w="fit-content"
        >
          More details
        </Link>
      </VStack>
    </>
  );
};

export default React.memo(TxAdditionalInfoContent);
