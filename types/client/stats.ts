export enum StatsSectionId {
  'all',
  'accounts',
  'blocks',
  'transactions',
  'gas',
}
export type StatsSectionIds = keyof typeof StatsSectionId;
export type StatsSection = { id: StatsSectionIds; value: string }

export enum StatsIntervalId {
  'all',
  'oneMonth',
  'threeMonths',
  'sixMonths',
  'oneYear',
}
export type StatsIntervalIds = keyof typeof StatsIntervalId;
export type StatsInterval = { id: StatsIntervalIds; value: string }
