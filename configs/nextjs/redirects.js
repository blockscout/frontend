const oldUrls = [
  // ACCOUNT
  {
    source: '/account/tag_transaction',
    destination: '/account/tag_address?tab=tx',
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

  // BLOCKS
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
    source: '/tokens/:hash/:path*',
    destination: '/token/:hash/:path*',
  },
  {
    source: '/token/:hash/token-transfers',
    destination: '/token/:hash',
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
];

async function redirects() {
  return [
    ...oldUrls.map((item) => ({ ...item, permanent: false })),
  ];
}

module.exports = redirects;
