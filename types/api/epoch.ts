export type Epoch = {
  id: string;
  duration: string;
  endTime: string;
  epochFee: string;
};

export type ValidatorRewardPerEpoch = {
  validatorId: string;
  reward: string;
};

export type ActualValidatorRewardPerEpoch = {
  id: string;
  totalReward: string;
};
