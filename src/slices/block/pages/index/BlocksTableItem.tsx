// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { ClusterChainConfig } from 'src/features/multichain/types/client';
import type { Block } from 'src/slices/block/types/api';

import { route } from 'nextjs-routes';

import AddressEntity from 'src/slices/address/components/entity/AddressEntity';
import BlockPendingUpdateHint from 'src/slices/block/components/BlockPendingUpdateHint';
import BlockEntity from 'src/slices/block/components/entity/BlockEntity';
import getBlockTotalReward from 'src/slices/block/utils/get-block-total-reward';
import GasUsed from 'src/slices/gas/components/GasUsed';

import config from 'src/config';
import TimeWithTooltip from 'src/shared/date-and-time/TimeWithTooltip';
import ChainIcon from 'src/shared/external-chains/ChainIcon';
import NativeCoinValue from 'src/shared/values/entity/NativeCoinValue';
import SimpleValue from 'src/shared/values/entity/SimpleValue';
import Utilization from 'src/shared/values/utilization/Utilization';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'src/toolkit/chakra/table';
import { Tooltip } from 'src/toolkit/chakra/tooltip';

interface Props {
  data: Block;
  isLoading?: boolean;
  animation?: string;
  enableTimeIncrement?: boolean;
  chainData?: ClusterChainConfig;
}

const isRollup = config.features.rollup.isEnabled;

const BlocksTableItem = ({ data, isLoading, enableTimeIncrement, animation, chainData }: Props) => {
  const totalReward = getBlockTotalReward(data);
  const burntFees = BigNumber(data.burnt_fees || 0);
  const txFees = BigNumber(data.transaction_fees || 0);

  return (
    <TableRow animation={ animation }>
      { chainData && (
        <TableCell>
          <ChainIcon data={ chainData } isLoading={ isLoading }/>
        </TableCell>
      ) }
      <TableCell >
        <Flex columnGap={ 2 } alignItems="center" mb={ 2 }>
          { data.celo?.l1_era_finalized_epoch_number && (
            <Tooltip content={ `Finalized epoch #${ data.celo.l1_era_finalized_epoch_number }` }>
              <SpriteIcon name="checkered_flag" boxSize={ 5 } p="1px" isLoading={ isLoading } flexShrink={ 0 }/>
            </Tooltip>
          ) }
          { data.is_pending_update && <BlockPendingUpdateHint/> }
          <Tooltip disabled={ data.type !== 'reorg' } content="Chain reorganizations">
            <span>
              <BlockEntity
                isLoading={ isLoading }
                number={ data.height }
                hash={ data.type !== 'block' ? data.hash : undefined }
                noIcon
                fontWeight={ 600 }
              />
            </span>
          </Tooltip>
        </Flex>
        <TimeWithTooltip
          timestamp={ data.timestamp }
          enableIncrement={ enableTimeIncrement }
          isLoading={ isLoading }
          color="text.secondary"
          fontWeight={ 400 }
          display="inline-block"
        />
      </TableCell>
      <TableCell >
        <Skeleton loading={ isLoading } display="inline-block">
          { data.size?.toLocaleString() || 'N/A' }
        </Skeleton>
      </TableCell>
      { !config.slices.block.hiddenFields?.miner && (
        <TableCell >
          <AddressEntity
            address={ data.miner }
            isLoading={ isLoading }
            truncation="constant"
          />
        </TableCell>
      ) }
      <TableCell isNumeric >
        { data.transactions_count > 0 ? (
          <Skeleton loading={ isLoading } display="inline-block">
            <Link href={ route({
              pathname: '/block/[height_or_hash]',
              query: { height_or_hash: String(data.height), tab: 'txs' },
            }) }>
              { data.transactions_count }
            </Link>
          </Skeleton>
        ) : data.transactions_count }
      </TableCell>
      <TableCell >
        <Skeleton loading={ isLoading } display="inline-block">{ BigNumber(data.gas_used || 0).toFormat() }</Skeleton>
        <Flex mt={ 2 }>
          <GasUsed
            gasUsed={ data.gas_used || undefined }
            gasLimit={ data.gas_limit }
            isLoading={ isLoading }
            gasTarget={ data.gas_target_percentage || undefined }
          />
        </Flex>
      </TableCell>
      { !isRollup && !config.slices.block.hiddenFields?.total_reward && (
        <TableCell >
          <SimpleValue value={ totalReward } loading={ isLoading }/>
        </TableCell>
      ) }
      { !isRollup && !config.slices.block.hiddenFields?.burnt_fees && (
        <TableCell >
          <NativeCoinValue
            amount={ data.burnt_fees }
            noSymbol
            startElement={ <SpriteIcon name="flame" mr={ 2 } boxSize={ 5 } color={{ _light: 'gray.500', _dark: 'inherit' }} isLoading={ isLoading }/> }
            loading={ isLoading }
            display="flex"
          />
          <Tooltip content="Burnt fees / Txn fees * 100%" disabled={ isLoading }>
            <Utilization mt={ 2 } w="min-content" value={ burntFees.div(txFees).toNumber() } isLoading={ isLoading }/>
          </Tooltip>
        </TableCell>
      ) }
      { !isRollup && !config.slices.block.hiddenFields?.base_fee && data.base_fee_per_gas && (
        <TableCell isNumeric>
          <NativeCoinValue
            amount={ data.base_fee_per_gas }
            loading={ isLoading }
            gweiThreshold={ 4 }
            units="wei"
          />
        </TableCell>
      ) }
    </TableRow>
  );
};

export default React.memo(BlocksTableItem);
