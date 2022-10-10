import { utils } from 'ethers';

import type { Block } from 'types/api/block';

export default function getBlockReward(block: Block) {
  const txFees = utils.parseUnits(block.tx_fees || '0', 'wei');
  const burntFees = utils.parseUnits(String(block.burnt_fees || '0'), 'wei');
  const totalReward = utils.parseUnits(
    String(
      block.rewards?.find(({ type }) => type === 'Miner Reward' || type === 'Validator Reward')?.reward ||
      '0',
    ),
    'wei',
  );
  const staticReward = totalReward.sub(txFees).add(burntFees);

  return {
    totalReward,
    staticReward,
    txFees,
    burntFees,
  };
}
