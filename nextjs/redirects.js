const oldUrls = [
  // ACCOUNT
  {
    source: '/account/tag_address',
    destination: '/account/tag-address',
  },
  {
    source: '/account/tag_address/new',
    destination: '/account/tag-address',
  },
  {
    source: '/account/tag_transaction',
    destination: '/account/tag-address?tab=tx',
  },
  {
    source: '/account/tag_transaction/new',
    destination: '/account/tag-address?tab=tx',
  },
  {
    source: '/account/watchlist_address/:id/edit',
    destination: '/account/watchlist',
  },
  {
    source: '/account/watchlist_address/new',
    destination: '/account/watchlist',
  },
  {
    source: '/account/api_key',
    destination: '/account/api-key',
  },
  {
    source: '/account/api_key/:id/edit',
    destination: '/account/api-key',
  },
  {
    source: '/account/api_key/new',
    destination: '/account/api-key',
  },
  {
    source: '/account/custom_abi',
    destination: '/account/custom-abi',
  },
  {
    source: '/account/custom_abi/:id/edit',
    destination: '/account/custom-abi',
  },
  {
    source: '/account/custom_abi/new',
    destination: '/account/custom-abi',
  },
  {
    source: '/account/public-tags-request',
    destination: '/public-tags/submit',
  },
  {
    source: '/account/rewards',
    destination: '/account/merits',
  },

  // TRANSACTIONS
  {
    source: '/pending-transactions',
    destination: '/txs?tab=pending',
  },
  {
    source: '/tx/:hash/internal-transactions',
    destination: '/tx/:hash?tab=internal',
  },
  {
    source: '/tx/:hash/logs',
    destination: '/tx/:hash?tab=logs',
  },
  {
    source: '/tx/:hash/raw-trace',
    destination: '/tx/:hash?tab=raw_trace',
  },
  {
    source: '/tx/:hash/state',
    destination: '/tx/:hash?tab=state',
  },
  {
    source: '/tx/:hash/token-transfers',
    destination: '/tx/:hash?tab=token_transfers',
  },

  // BLOCKS
  {
    source: '/blocks/:height/:path*',
    destination: '/block/:height/:path*',
  },
  {
    source: '/uncles',
    destination: '/blocks?tab=uncles',
  },
  {
    source: '/reorgs',
    destination: '/blocks?tab=reorgs',
  },
  {
    source: '/block/:height/transactions',
    destination: '/block/:height?tab=txs',
  },
  {
    source: '/block/:height/withdrawals',
    destination: '/block/:height?tab=withdrawals',
  },

  // ADDRESS
  {
    source: '/address/:hash/transactions',
    destination: '/address/:hash',
  },
  {
    source: '/address/:hash/token-transfers',
    destination: '/address/:hash?tab=token_transfers',
  },
  {
    source: '/address/:hash/tokens',
    destination: '/address/:hash?tab=tokens',
  },
  {
    source: '/address/:hash/internal-transactions',
    destination: '/address/:hash?tab=internal_txns',
  },
  {
    source: '/address/:hash/coin-balances',
    destination: '/address/:hash?tab=coin_balance_history',
  },
  {
    source: '/address/:hash/logs',
    destination: '/address/:hash?tab=logs',
  },
  {
    source: '/address/:hash/validations',
    destination: '/address/:hash?tab=blocks_validated',
  },
  {
    source: '/address/:hash/contracts',
    destination: '/address/:hash?tab=contract',
  },
  {
    source: '/address/:hash/read-contract',
    destination: '/address/:hash?tab=read_contract',
  },
  {
    source: '/address/:hash/read-proxy',
    destination: '/address/:hash?tab=read_proxy',
  },
  {
    source: '/address/:hash/write-contract',
    destination: '/address/:hash?tab=write_contract',
  },
  {
    source: '/address/:hash/write-proxy',
    destination: '/address/:hash?tab=write_proxy',
  },
  {
    source: '/address/:hash/tokens/:token_hash/token-transfers',
    destination: '/address/:hash?tab=token_transfers&token=:token_hash',
  },

  // CONTRACT VERIFICATION
  {
    source: '/address/:hash/contract_verifications/new',
    destination: '/address/:hash/contract_verification',
  },
  {
    source: '/address/:hash/verify-via-flattened-code/new',
    destination: '/address/:hash/contract_verification?method=flatten_source_code',
  },
  {
    source: '/address/:hash/verify-via-standard-json-input/new',
    destination: '/address/:hash/contract_verification?method=standard_input',
  },
  {
    source: '/address/:hash/verify-via-metadata-json/new',
    destination: '/address/:hash/contract_verification?method=sourcify',
  },
  {
    source: '/address/:hash/verify-via-multi-part-files/new',
    destination: '/address/:hash/contract_verification?method=multi_part_file',
  },
  {
    source: '/address/:hash/verify-vyper-contract/new',
    destination: '/address/:hash/contract_verification?method=vyper_contract',
  },

  // TOKENS
  {
    source: '/bridged-tokens',
    destination: '/tokens/?tab=bridged',
  },
  {
    source: '/bridged-tokens/:chain_name',
    destination: '/tokens/?tab=bridged',
  },
  {
    source: '/tokens/:hash/:path*',
    destination: '/token/:hash/:path*',
  },
  {
    source: '/token/:hash/token-transfers',
    destination: '/token/:hash/?tab=token_transfers',
  },
  {
    source: '/token/:hash/token-holders',
    destination: '/token/:hash/?tab=holders',
  },
  {
    source: '/token/:hash/inventory',
    destination: '/token/:hash/?tab=inventory',
  },
  {
    source: '/token/:hash/instance/:id/token-transfers',
    destination: '/token/:hash/instance/:id',
  },
  {
    source: '/token/:hash/instance/:id/token-holders',
    destination: '/token/:hash/instance/:id?tab=holders',
  },
  {
    source: '/token/:hash/instance/:id/metadata',
    destination: '/token/:hash/instance/:id?tab=metadata',
  },
  {
    source: '/token/:hash/read-contract',
    destination: '/token/:hash?tab=read_contract',
  },
  {
    source: '/token/:hash/read-proxy',
    destination: '/token/:hash?tab=read_proxy',
  },
  {
    source: '/token/:hash/write-contract',
    destination: '/token/:hash?tab=write_contract',
  },
  {
    source: '/token/:hash/write-proxy',
    destination: '/token/:hash?tab=write_proxy',
  },

  // ROLLUPs
  {
    source: '/l2-txn-batches',
    destination: '/batches',
  },
  {
    source: '/zkevm-l2-txn-batches',
    destination: '/batches',
  },
  {
    source: '/zkevm-l2-txn-batch/:path*',
    destination: '/batches/:path*',
  },
  {
    source: '/l2-deposits',
    destination: '/deposits',
  },
  {
    source: '/l2-withdrawals',
    destination: '/withdrawals',
  },
  {
    source: '/l2-output-roots',
    destination: '/output-roots',
  },
];

async function redirects() {
  return [
    ...oldUrls.map((item) => ({ ...item, permanent: false })),
  ];
}

module.exports = redirects;
