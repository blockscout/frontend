import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { Link } from 'toolkit/chakra/link';
import { Tag } from 'toolkit/chakra/tag';
import { Tooltip } from 'toolkit/chakra/tooltip';

import type { BlockQuery } from './useBlockQuery';

interface Props {
  blockQuery: BlockQuery;
}

const BlockCeloEpochTag = ({ blockQuery }: Props) => {
  if (!blockQuery.data?.celo) {
    return null;
  }

  if (!blockQuery.data.celo.is_epoch_block) {
    const celoConfig = config.features.celo;
    const epochBlockNumber = celoConfig.isEnabled && celoConfig.L2UpgradeBlock && blockQuery.data.height <= celoConfig.L2UpgradeBlock ?
      blockQuery.data.celo.epoch_number * celoConfig.BLOCKS_PER_EPOCH :
      undefined;
    const content = epochBlockNumber ? (
      <Link href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: String(epochBlockNumber) } }) }>
        <Tag variant="clickable">Epoch #{ blockQuery.data.celo.epoch_number }</Tag>
      </Link>
    ) : <Tag>Epoch #{ blockQuery.data.celo.epoch_number }</Tag>;

    return (
      <Tooltip
        key="epoch-tag-before-finalized"
        content="Displays the epoch this block belongs to before the epoch is finalized"
      >
        { content }
      </Tooltip>
    );
  }

  return (
    <Tooltip
      key="epoch-tag"
      content="Displays the epoch finalized by this block"
    >
      <Tag bgColor="celo" color="blackAlpha.800" > Finalized epoch #{ blockQuery.data.celo.epoch_number } </Tag>
    </Tooltip>
  );
};

export default React.memo(BlockCeloEpochTag);
