export type ZetaChainCCTXListResponse = {
  items: Array<ZetaChainCCTX>;
  next_page_params: {
    page_index: number;
    offset: number;
    direction: 'ASC' | 'DESC';
  } | null;
};

export type ZetaChainCCTX = {
  index: string;
  amount: string;
  coin_type: ZetaChainCCTXCoinType;
  created_timestamp: string;
  last_update_timestamp: string;
  receiver_address: string;
  sender_address: string;
  source_chain_id: string;
  status: ZetaChainCCTXStatus;
  status_reduced: ZetaChainCCTXStatusReduced;
  target_chain_id: string;
  token_symbol?: string;
  asset?: string;
  decimals?: string | null;
};

export type ZetaChainCCTXStatus = 'PENDING_OUTBOUND' | 'PENDING_INBOUND' | 'OUTBOUND_MINED' | 'PENDING_REVERT' | 'ABORTED' | 'REVERTED';

export type ZetaChainCCTXStatusReduced = 'SUCCESS' | 'PENDING' | 'FAILED';

export type ZetaChainCCTXCoinType = 'ZETA' | 'GAS' | 'ERC20' | 'CMD' | 'NO_ASSET_CALL';
