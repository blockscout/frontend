export interface PageData<T> {
  hasNext: boolean;
  hasPrev: boolean;
  items: Array<T>;
  pageNo: number;
  pageSize: number;
  totalCount: string;
  totalPage: number;
}

export interface PageParams {
  pageNo?: number;
  pageSize?: number;
}

export interface ProviderInfo {
  totalCap: string;
  totalClaim: string;
  totalPunish: string;
  totalReward: string;
  totalDevice: string;
}

export type ProvidersPage = PageData<{
  providerCap: string;
  providerClaimAmount: string;
  providerCreateTimeOnChain: string;
  providerDeviceCount: string;
  providerID: string;
  providerOwnerAddress: string;
  providerPunishAmount: string;
  providerPunishCount: string;
  providerRewardAmount: string;
  providerTotalCap: string;
}>;

export interface TableColumn<T> {
  id: string;
  label: string;
  width?: string;
  textAlgin?:
  | 'center'
  | 'end'
  | 'justify'
  | 'left'
  | 'match-parent'
  | 'right'
  | 'start';
  render?: (data: T, index?: number) => any;
}

export type NodesPage = PageData<{
  validatorName: string;
  validatorIncomeDistributionType: string;
  validatorAddress: string;
  validatorStatus: string;
  validatorFeeRatio: string;
  validatorAllowNominator: boolean;
  validatorLastBlock: string | null;
  validatorRegistrationTime: string;
}>;

export interface NodesParams extends PageParams {
  nominatorAddress?: string; // 提名人地址，不传返回所有的验证人列表，传了返回该提名人关联的验证人列表
  validatorStatus?: string; // 根据验证人状态查询,，Waiting表示等待中, Active表示已激活
  forNominatorCreation?: string; // 创建提名人选择关联的验证人传true，其它的默认为false，可以不传
  searchStr?: string; // 根据validator地址或者名称模糊查询
}

export interface EraInfo {
  eraStartTime: string;
  eraDuration: string;
}

export interface EpochInfo {
  epochStartTime: string;
  epochDuration: string;
}

export interface StakeValidatorInfo {
  stash_account: string;
  state: boolean;
  total_staking: string;
  owner_staking: string;
  nominators: string;
  commission: string;
  can_nominated: boolean;
}

export type StakeValidatorInfoParams = Array<Array<string>>;
