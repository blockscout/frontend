import { Box, Text, Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import getValueWithUnit from 'lib/getValueWithUnit';
import { currencyUnits } from 'lib/units';
import { Link } from 'toolkit/chakra/link';
import BlobEntity from 'ui/shared/entities/blob/BlobEntity';
import TextSeparator from 'ui/shared/TextSeparator';
import TxFee from 'ui/shared/tx/TxFee';
import Utilization from 'ui/shared/Utilization/Utilization';

const TxAdditionalInfoContent = ({ tx }: { tx: Transaction }) => {
  const sectionProps = {
    borderBottom: '1px solid',
    borderColor: 'border.divider',
    paddingBottom: 4,
  };

  const sectionTitleProps = {
    color: 'gray.500',
    fontWeight: 600,
    marginBottom: 3,
  };

  return (
    <>
      { tx.blob_versioned_hashes && tx.blob_versioned_hashes.length > 0 && (
        <Box { ...sectionProps } mb={ 4 }>
          <Flex alignItems="center" justifyContent="space-between">
            <Text { ...sectionTitleProps }>Blobs: { tx.blob_versioned_hashes.length }</Text>
            { tx.blob_versioned_hashes.length > 3 && (
              <Link
                href={ route({ pathname: '/tx/[hash]', query: { hash: tx.hash, tab: 'blobs' } }) }
                mb={ 3 }
              >
                view all
              </Link>
            ) }
          </Flex>
          <Flex flexDir="column" rowGap={ 3 }>
            { tx.blob_versioned_hashes.slice(0, 3).map((hash, index) => (
              <Flex key={ hash } columnGap={ 2 }>
                <Box fontWeight={ 500 }>{ index + 1 }</Box>
                <BlobEntity hash={ hash } noIcon/>
              </Flex>
            )) }
          </Flex>
        </Box>
      ) }
      { !config.UI.views.tx.hiddenFields?.tx_fee && (
        <Box { ...sectionProps } mb={ 4 }>
          { (tx.stability_fee !== undefined || tx.fee.value !== null) && (
            <>
              <Text { ...sectionTitleProps }>Transaction fee</Text>
              <TxFee tx={ tx } withUsd accuracyUsd={ 2 } rowGap={ 0 }/>
            </>
          ) }
        </Box>
      ) }
      { tx.gas_used !== null && (
        <Box { ...sectionProps } mb={ 4 }>
          <Text { ...sectionTitleProps }>Gas limit & usage by transaction</Text>
          <Flex>
            <Text>{ BigNumber(tx.gas_used).toFormat() }</Text>
            <TextSeparator/>
            <Text>{ BigNumber(tx.gas_limit).toFormat() }</Text>
            <Utilization ml={ 4 } value={ Number(BigNumber(tx.gas_used).dividedBy(BigNumber(tx.gas_limit)).toFixed(2)) }/>
          </Flex>
        </Box>
      ) }
      { !config.UI.views.tx.hiddenFields?.gas_fees &&
        (tx.base_fee_per_gas !== null || tx.max_fee_per_gas !== null || tx.max_priority_fee_per_gas !== null) && (
        <Box { ...sectionProps } mb={ 4 }>
          <Text { ...sectionTitleProps }>Gas fees ({ currencyUnits.gwei })</Text>
          { tx.base_fee_per_gas !== null && (
            <Box>
              <Text as="span" fontWeight="500">Base: </Text>
              <Text fontWeight="700" as="span">{ getValueWithUnit(tx.base_fee_per_gas, 'gwei').toFormat() }</Text>
            </Box>
          ) }
          { tx.max_fee_per_gas !== null && (
            <Box mt={ 1 }>
              <Text as="span" fontWeight="500">Max: </Text>
              <Text fontWeight="700" as="span">{ getValueWithUnit(tx.max_fee_per_gas, 'gwei').toFormat() }</Text>
            </Box>
          ) }
          { tx.max_priority_fee_per_gas !== null && (
            <Box mt={ 1 }>
              <Text as="span" fontWeight="500">Max priority: </Text>
              <Text fontWeight="700" as="span">{ getValueWithUnit(tx.max_priority_fee_per_gas, 'gwei').toFormat() }</Text>
            </Box>
          ) }
        </Box>
      ) }
      { !(tx.blob_versioned_hashes && tx.blob_versioned_hashes.length > 0) && (
        <Box { ...sectionProps } mb={ 4 }>
          <Text { ...sectionTitleProps }>Others</Text>
          <Box>
            <Text as="span" fontWeight="500">Txn type: </Text>
            <Text fontWeight="600" as="span">{ tx.type }</Text>
            { tx.type === 2 && <Text fontWeight="400" as="span" ml={ 1 } color="gray.500">(EIP-1559)</Text> }
          </Box>
          <Box mt={ 1 }>
            <Text as="span" fontWeight="500">Nonce: </Text>
            <Text fontWeight="600" as="span">{ tx.nonce }</Text>
          </Box>
          <Box mt={ 1 }>
            <Text as="span" fontWeight="500">Position: </Text>
            <Text fontWeight="600" as="span">{ tx.position }</Text>
          </Box>
        </Box>
      ) }
      <Link href={ route({ pathname: '/tx/[hash]', query: { hash: tx.hash } }) }>More details</Link>
    </>
  );
};

export default React.memo(TxAdditionalInfoContent);
