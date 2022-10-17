export interface Reward {
  reward: number;
  type: 'Miner Reward' | 'Validator Reward' | 'Emission Reward' | 'Chore Reward' | 'Uncle Reward';
}
