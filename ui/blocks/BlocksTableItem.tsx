import { Flex } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { Block } from 'types/api/block';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import getBlockTotalReward from 'lib/block/getBlockTotalReward';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { WEI } from 'toolkit/utils/consts';
import BlockGasUsed from 'ui/shared/block/BlockGasUsed';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import IconSvg from 'ui/shared/IconSvg';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';
import Utilization from 'ui/shared/Utilization/Utilization';

import { getBaseFeeValue } from './utils';

interface Props {
  data: Block;
  isLoading?: boolean;
  animation?: string;
  enableTimeIncrement?: boolean;
}

const isRollup = config.features.rollup.isEnabled;

const BlocksTableItem = ({ data, isLoading, enableTimeIncrement, animation }: Props) => {
  const totalReward = getBlockTotalReward(data);
  const burntFees = BigNumber(data.burnt_fees || 0);
  const txFees = BigNumber(data.transaction_fees || 0);
  const baseFeeValue = getBaseFeeValue(data.base_fee_per_gas);

  return (
    <TableRow animation={ animation }>
      <TableCell >
        <Flex columnGap={ 2 } alignItems="center" mb={ 2 }>
          { data.celo?.is_epoch_block && (
            <Tooltip content={ `Finalized epoch #${ data.celo.epoch_number }` }>
              <IconSvg name="checkered_flag" boxSize={ 5 } p="1px" isLoading={ isLoading } flexShrink={ 0 }/>
            </Tooltip>
          ) }
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
          { data.size.toLocaleString() }
        </Skeleton>
      </TableCell>
      { !config.UI.views.block.hiddenFields?.miner && (
        <TableCell >
          <AddressEntity
            address={ data.miner }
            isLoading={ isLoading }
            truncation="constant"
            maxW="min-content"
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
          <BlockGasUsed
            gasUsed={ data.gas_used || undefined }
            gasLimit={ data.gas_limit }
            isLoading={ isLoading }
            gasTarget={ data.gas_target_percentage || undefined }
          />
        </Flex>
      </TableCell>
      { !isRollup && !config.UI.views.block.hiddenFields?.total_reward && (
        <TableCell >
          <Skeleton loading={ isLoading } display="inline-block">
            { totalReward.toFixed(8) }
          </Skeleton>
        </TableCell>
      ) }
      { !isRollup && !config.UI.views.block.hiddenFields?.burnt_fees && (
        <TableCell >
          <Flex alignItems="center" columnGap={ 2 }>
            <IconSvg name="flame" boxSize={ 5 } color={{ _light: 'gray.500', _dark: 'inherit' }} isLoading={ isLoading }/>
            <Skeleton loading={ isLoading } display="inline-block">
              { burntFees.dividedBy(WEI).toFixed(8) }
            </Skeleton>
          </Flex>
          <Tooltip content="Burnt fees / Txn fees * 100%" disabled={ isLoading }>
            <Utilization mt={ 2 } w="min-content" value={ burntFees.div(txFees).toNumber() } isLoading={ isLoading }/>
          </Tooltip>
        </TableCell>
      ) }
      { !isRollup && !config.UI.views.block.hiddenFields?.base_fee && Boolean(baseFeeValue) && (
        <TableCell isNumeric>
          <Skeleton loading={ isLoading } display="inline-block" whiteSpace="pre-wrap" wordBreak="break-word">
            { baseFeeValue }
          </Skeleton>
        </TableCell>
      ) }
    </TableRow>
  );
};

export default React.memo(BlocksTableItem);
