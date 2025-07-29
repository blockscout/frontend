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

export type ZetaChainCCTXResponse = {
  creator: string;
  index: string;
  zeta_fees: string;
  relayed_message: string;
  cctx_status: {
    status: ZetaChainCCTXStatus;
    status_message: string;
    error_message: string;
    last_update_timestamp: string;
    is_abort_refunded: boolean;
    created_timestamp: string;
    error_message_revert: string;
    error_message_abort: string;
  };
  inbound_params: {
    sender: string;
    sender_chain_id: string;
    tx_origin: string;
    coin_type: ZetaChainCCTXCoinType;
    asset: string;
    amount: string;
    observed_hash: string;
    observed_external_height: string;
    ballot_index: string;
    finalized_zeta_height: string;
    tx_finalization_status: ZetaChainCCTXFinalizationStatus;
    is_cross_chain_call: boolean;
    status: ZetaChainCCTXInboundStatus;
    confirmation_mode: ZetaChainCCTXConfirmationMode;
  };
  outbound_params: Array<{
    receiver: string;
    receiver_chain_id: string;
    coin_type: ZetaChainCCTXCoinType;
    amount: string;
    tss_nonce: string;
    gas_limit: string;
    gas_price: string;
    gas_priority_fee: string;
    hash: string;
    ballot_index: string;
    observed_external_height: string;
    gas_used: string;
    effective_gas_price: string;
    effective_gas_limit: string;
    tss_pubkey: string;
    tx_finalization_status: ZetaChainCCTXFinalizationStatus;
    call_options: {
      gas_limit: string;
      is_arbitrary_call: boolean;
    };
    confirmation_mode: ZetaChainCCTXConfirmationMode;
  }>;
  protocol_contract_version: string;
  revert_options: {
    revert_address: string;
    call_on_revert: boolean;
    abort_address: string;
    revert_message: string;
    revert_gas_limit: string;
  };
  related_cctxs: Array<{
    index: string;
    depth: number;
    source_chain_id: string;
    status: ZetaChainCCTXStatus;
    inbound_amount: string;
    inbound_coin_type: ZetaChainCCTXCoinType;
    outbound_params: Array<{
      amount: string;
      chain_id: string;
      coin_type: ZetaChainCCTXCoinType;
    }>;
  }>;
};

export type ZetaChainCCTXStatus = 'PENDING_OUTBOUND' | 'PENDING_INBOUND' | 'OUTBOUND_MINED' | 'PENDING_REVERT' | 'ABORTED' | 'REVERTED';

export type ZetaChainCCTXStatusReduced = 'SUCCESS' | 'PENDING' | 'FAILED';

export type ZetaChainCCTXCoinType = 'ZETA' | 'GAS' | 'ERC20' | 'CMD' | 'NO_ASSET_CALL';

export type ZetaChainCCTXFinalizationStatus = 'FINALIZED' | 'NOT_FINALIZED';

export type ZetaChainCCTXConfirmationMode = 'SAFE' | 'FAST';

export type ZetaChainCCTXInboundStatus = 'SUCCESS' | 'INSUFFICIENT_DEPOSITOR_FEE' | 'INVALID_RECEIVER_ADDRESS' | 'INVALID_MEMO';
