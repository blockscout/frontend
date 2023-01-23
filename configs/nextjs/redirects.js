const PATHS = require('../../lib/link/paths.json');

const oldUrls = [
  {
    oldPath: '/account/tag_transaction',
    newPath: `${ PATHS.private_tags }?tab=tx`,
  },
  {
    oldPath: '/pending-transactions',
    newPath: `${ PATHS.txs }?tab=pending`,
  },
  {
    oldPath: '/tx/:id/internal-transactions',
    newPath: `${ PATHS.tx }?tab=internal`,
  },
  {
    oldPath: '/tx/:id/logs',
    newPath: `${ PATHS.tx }?tab=logs`,
  },
  {
    oldPath: '/tx/:id/raw-trace',
    newPath: `${ PATHS.tx }?tab=raw_trace`,
  },
  {
    oldPath: '/tx/:id/state',
    newPath: `${ PATHS.tx }?tab=state`,
  },
  {
    oldPath: '/uncles',
    newPath: `${ PATHS.blocks }?tab=uncles`,
  },
  {
    oldPath: '/reorgs',
    newPath: `${ PATHS.blocks }?tab=reorgs`,
  },
  {
    oldPath: '/block/:id/transactions',
    newPath: `${ PATHS.block }`,
  },
  {
    oldPath: '/address/:id/transactions',
    newPath: `${ PATHS.address_index }`,
  },
  {
    oldPath: '/address/:id/token-transfers',
    newPath: `${ PATHS.address_index }?tab=token_transfers`,
  },
  {
    oldPath: '/address/:id/tokens',
    newPath: `${ PATHS.address_index }?tab=tokens`,
  },
  {
    oldPath: '/address/:id/internal-transactions',
    newPath: `${ PATHS.address_index }?tab=internal_txns`,
  },
  {
    oldPath: '/address/:id/coin-balances',
    newPath: `${ PATHS.address_index }?tab=coin_balance_history`,
  },
  {
    oldPath: '/address/:id/validations',
    newPath: `${ PATHS.address_index }?tab=blocks_validated`,
  },
  // contract verification
  {
    oldPath: '/address/:id/contract_verifications/new',
    newPath: `${ PATHS.address_contract_verification }`,
  },
  {
    oldPath: '/address/:id/verify-via-flattened-code/new',
    newPath: `${ PATHS.address_contract_verification }?method=flatten_source_code`,
  },
  {
    oldPath: '/address/:id/verify-via-standard-json-input/new',
    newPath: `${ PATHS.address_contract_verification }?method=standard_input`,
  },
  {
    oldPath: '/address/:id/verify-via-metadata-json/new',
    newPath: `${ PATHS.address_contract_verification }?method=sourcify`,
  },
  {
    oldPath: '/address/:id/verify-via-multi-part-files/new',
    newPath: `${ PATHS.address_contract_verification }?method=multi_part_file`,
  },
  {
    oldPath: '/address/:id/verify-vyper-contract/new',
    newPath: `${ PATHS.address_contract_verification }?method=vyper_contract`,
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
