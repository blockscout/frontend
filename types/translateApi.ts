export interface ResponseData {
  txTypeVersion: number;
  chain: string;
  accountAddress: string;
  classificationData: ClassificationData;
  rawTransactionData: RawTransactionData;
}

export interface ClassificationData {
  type: string;
  description: string;
  sent: Array<SentReceived>;
  received: Array<SentReceived>;
  source: {
    type: string | null;
  };
  message?: string;
}

export interface SentReceived {
  action: string;
  amount: string;
  to: To;
  from: From;
  token?: Token;
  nft?: Nft;
}

export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  id?: string;
}

export interface Nft {
  name: string;
  id: string;
  symbol: string;
  address: string;
}

export interface From {
  name: string | null;
  address: string;
}

export interface To {
  name: string | null;
  address: string;
}

export interface RawTransactionData {
  transactionHash: string;
  fromAddress: string;
  toAddress: string;
  blockNumber: number;
  gas: number;
  gasPrice: number;
  transactionFee: TransactionFee | number;
  timestamp: number;
}

export interface TransactionFee {
  amount: string;
  currency: string;
}

export interface AccountHistoryResponse {
  hasNextPage: boolean;
  items: Array<ResponseData>;
  pageNumber: number;
  pageSize: number;
  nextPageUrl?: string;
}

export const HistorySentReceivedFilterValues = [ 'received', 'sent' ] as const;

export type HistorySentReceivedFilter = typeof HistorySentReceivedFilterValues[number] | undefined;

export interface HistoryFilters {
  filter?: HistorySentReceivedFilter;
}

export interface DescribeResponse {
  type: string;
  description: string;
}
