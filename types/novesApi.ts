export interface NovesResponseData {
  txTypeVersion: number;
  chain: string;
  accountAddress: string;
  classificationData: NovesClassificationData;
  rawTransactionData: NovesRawTransactionData;
}

export interface NovesClassificationData {
  type: string;
  typeFormatted: string;
  description: string;
  sent: Array<NovesSentReceived>;
  received: Array<NovesSentReceived>;
  source: {
    type: string | null;
  };
  message?: string;
}

export interface NovesSentReceived {
  action: string;
  actionFormatted: string;
  amount: string;
  to: NovesTo;
  from: NovesFrom;
  token?: NovesToken;
  nft?: NovesNft;
}

export interface NovesToken {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  id?: string;
}

export interface NovesNft {
  name: string;
  id: string;
  symbol: string;
  address: string;
}

export interface NovesFrom {
  name: string | null;
  address: string;
}

export interface NovesTo {
  name: string | null;
  address: string;
}

export interface NovesRawTransactionData {
  transactionHash: string;
  fromAddress: string;
  toAddress: string;
  blockNumber: number;
  gas: number;
  gasPrice: number;
  transactionFee: NovesTransactionFee | number;
  timestamp: number;
}

export interface NovesTransactionFee {
  amount: string;
  currency: string;
}

export interface NovesAccountHistoryResponse {
  hasNextPage: boolean;
  items: Array<NovesResponseData>;
  pageNumber: number;
  pageSize: number;
  nextPageUrl?: string;
}

export const NovesHistorySentReceivedFilterValues = [ 'received', 'sent' ] as const;

export type NovesHistorySentReceivedFilter = typeof NovesHistorySentReceivedFilterValues[number] | undefined;

export interface NovesHistoryFilters {
  filter?: NovesHistorySentReceivedFilter;
}

export interface NovesDescribeResponse {
  type: string;
  description: string;
}
