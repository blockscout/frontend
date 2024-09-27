export type RewardsNonceResponse = {
  nonce: string;
};

export type RewardsCheckUserResponse = {
  exists: boolean;
};

export type RewardsLoginResponse = {
  created: boolean;
  token: string;
};
