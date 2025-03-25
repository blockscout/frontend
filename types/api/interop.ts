export interface ChainInfo {
  chain_id: number;
  chain_name: string | null;
  chain_logo: string | null;
  instance_url: string;
}

export type MessageStatus = 'Sent' | 'Relayed' | 'Failed';

export interface InteropMessage {
  init_transaction_hash: string;
  init_chain?: ChainInfo | null;
  nonce: number;
  payload: string;
  relay_chain?: ChainInfo | null;
  relay_transaction_hash: string | null;
  sender: string;
  status: MessageStatus;
  target: string;
  timestamp: string;
}

export interface InteropMessageListResponse {
  items: Array<InteropMessage>;
  next_page_params?: {
    init_transaction_hash: string;
    items_count: number;
    timestamp: number;
  };
}
