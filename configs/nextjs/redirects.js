const oldUrls = [
  {
    oldPath: '/account/tag_transaction',
    newPath: '/account/tag_address?tab=tx',
  },
  {
    oldPath: '/pending-transactions',
    newPath: '/txs?tab=pending',
  },
  {
    oldPath: '/tx/:hash/internal-transactions',
    newPath: '/tx/:hash?tab=internal',
  },
  {
    oldPath: '/tx/:hash/logs',
    newPath: '/tx/:hash?tab=logs',
  },
  {
    oldPath: '/tx/:hash/raw-trace',
    newPath: '/tx/:hash?tab=raw_trace',
  },
  {
    oldPath: '/tx/:hash/state',
    newPath: '/tx/:hash?tab=state',
  },
  {
    oldPath: '/uncles',
    newPath: '/blocks?tab=uncles',
  },
  {
    oldPath: '/reorgs',
    newPath: '/blocks?tab=reorgs',
  },
  {
    oldPath: '/block/:height/transactions',
    newPath: '/block/:height?tab=txs',
  },
  {
    oldPath: '/address/:hash/transactions',
    newPath: '/address/:hash',
  },
  {
    oldPath: '/address/:hash/token-transfers',
    newPath: '/address/:hash?tab=token_transfers',
  },
  {
    oldPath: '/address/:hash/tokens',
    newPath: '/address/:hash?tab=tokens',
  },
  {
    oldPath: '/address/:hash/internal-transactions',
    newPath: '/address/:hash?tab=internal_txns',
  },
  {
    oldPath: '/address/:hash/coin-balances',
    newPath: '/address/:hash?tab=coin_balance_history',
  },
  {
    oldPath: '/address/:hash/validations',
    newPath: '/address/:hash?tab=blocks_validated',
  },
  {
    oldPath: '/address/:hash/tokens/:token_hash/token-transfers',
    newPath: '/address/:hash?tab=token_transfers&token=:token_hash',
  },
  // contract verification
  {
    oldPath: '/address/:hash/contract_verifications/new',
    newPath: '/address/:hash/contract_verification',
  },
  {
    oldPath: '/address/:hash/verify-via-flattened-code/new',
    newPath: '/address/:hash/contract_verification?method=flatten_source_code',
  },
  {
    oldPath: '/address/:hash/verify-via-standard-json-input/new',
    newPath: '/address/:hash/contract_verification?method=standard_input',
  },
  {
    oldPath: '/address/:hash/verify-via-metadata-json/new',
    newPath: '/address/:hash/contract_verification?method=sourcify',
  },
  {
    oldPath: '/address/:hash/verify-via-multi-part-files/new',
    newPath: '/address/:hash/contract_verification?method=multi_part_file',
  },
  {
    oldPath: '/address/:hash/verify-vyper-contract/new',
    newPath: '/address/:hash/contract_verification?method=vyper_contract',
  },
];

async function redirects() {
  return [
    ...oldUrls.map(item => {
      const source = item.oldPath;
      const destination = item.newPath;
      return { source, destination, permanent: false };
    }),
  ];
}

module.exports = redirects;
