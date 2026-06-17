// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import getBlockTotalReward from 'src/slices/block/utils/get-block-total-reward';
import GasUsed from 'src/slices/gas/components/GasUsed';

import config from 'src/config';
import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import SimpleValue from 'src/shared/values/entity/SimpleValue';

import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';

interface Props {
  data: schemas['Block'];
  page: number;
  isLoading: boolean;
}

const AddressBlocksValidatedTableItem = ({ data, page, isLoading }: Props) => {
  const totalReward = getBlockTotalReward(data);

  return (
    <TableRow>
      <TableCell>
        <BlockEntity
          isLoading={ isLoading }
          number={ data.height }
          noIcon
          textStyle="sm"
          fontWeight={ 700 }
        />
      </TableCell>
      <TableCell>
        <TimeWithTooltip
          timestamp={ data.timestamp }
          enableIncrement={ page === 1 }
          isLoading={ isLoading }
          color="text.secondary"
          display="inline-block"
        />
      </TableCell>
      <TableCell>
        <Skeleton loading={ isLoading } display="inline-block" fontWeight="500">
          <span>{ data.transactions_count }</span>
        </Skeleton>
      </TableCell>
      <TableCell>
        <Flex alignItems="center" columnGap={ 2 }>
          <Skeleton loading={ isLoading } flexBasis="80px">
            { BigNumber(data.gas_used || 0).toFormat() }
          </Skeleton>
          <GasUsed
            gasUsed={ data.gas_used || undefined }
            gasLimit={ data.gas_limit }
            isLoading={ isLoading }
          />
        </Flex>
      </TableCell>
      { !config.slices.block.hiddenFields?.total_reward && !config.features.rollup.isEnabled && (
        <TableCell isNumeric>
          <SimpleValue
            value={ totalReward }
            accuracy={ 0 }
            loading={ isLoading }
          />
        </TableCell>
      ) }
    </TableRow>
  );
};

export default React.memo(AddressBlocksValidatedTableItem);
