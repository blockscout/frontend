import type { ProvidersPage, DeviceStatisticInfos } from "types/api/boolscan";

export const PROVIDERS: ProvidersPage["items"][0] = {
  providerID: "0",
  providerOwnerAddress: "0x000000000000000000000000000000000000",
  providerCap: "1000000000000000000000",
  providerCreateTimeOnChain: "1709973195000",
  providerDeviceCount: "0",
  providerPunishAmount: "0",
  providerPunishCount: "0",
  providerRewardAmount: "0",
  providerClaimAmount: "0",
  providerTotalCap: "0",
};

export const DHC: DeviceStatisticInfos = {
  day: "2024-03-22",
  reward: "659156470368266116584",
  punish: "1999964318803",
};
