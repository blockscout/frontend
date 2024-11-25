import { Tag, Tooltip, useDisclosure } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import LinkInternal from 'ui/shared/links/LinkInternal';

import type { BlockQuery } from './useBlockQuery';

interface Props {
  blockQuery: BlockQuery;
}

const BlockCeloEpochTag = ({ blockQuery }: Props) => {
  // have to implement controlled tooltip because of the issue - https://github.com/chakra-ui/chakra-ui/issues/7107
  const { isOpen, onOpen, onToggle, onClose } = useDisclosure();

  if (!blockQuery.data?.celo) {
    return null;
  }

  if (!blockQuery.data.celo.is_epoch_block) {
    const celoConfig = config.features.celo;
    const epochBlockNumber = celoConfig.isEnabled && celoConfig.L2UpgradeBlock && blockQuery.data.height <= celoConfig.L2UpgradeBlock ?
      blockQuery.data.celo.epoch_number * celoConfig.BLOCKS_PER_EPOCH :
      undefined;
    const tag = (
      <Tag
        colorScheme={ epochBlockNumber ? 'gray-blue' : 'gray' }
        onClick={ epochBlockNumber ? undefined : onToggle }
        onMouseEnter={ onOpen }
        onMouseLeave={ onClose }
      >
        Epoch #{ blockQuery.data.celo.epoch_number }
      </Tag>
    );
    const content = epochBlockNumber ? (
      <LinkInternal href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: String(epochBlockNumber) } }) }>
        { tag }
      </LinkInternal>
    ) : tag;

    return (
      <Tooltip
        label="Displays the epoch this block belongs to before the epoch is finalized"
        maxW="280px"
        textAlign="center"
        isOpen={ isOpen }
        onClose={ onClose }
      >
        { content }
      </Tooltip>
    );
  }

  return (
    <Tooltip
      label="Displays the epoch finalized by this block"
      maxW="280px"
      textAlign="center"
      isOpen={ isOpen }
      onClose={ onClose }
    >
      <Tag bgColor="celo" color="blackAlpha.800" onClick={ onToggle } onMouseEnter={ onOpen } onMouseLeave={ onClose }>
        Finalized epoch #{ blockQuery.data.celo.epoch_number }
      </Tag>
    </Tooltip>
  );
};

export default React.memo(BlockCeloEpochTag);
