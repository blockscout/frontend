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
    oldPath: '/block/:height/transactions',
    newPath: `${ PATHS.block }?tab=txs`,
  },
  {
    oldPath: '/address/:hash/transactions',
    newPath: `${ PATHS.address_index }`,
  },
  {
    oldPath: '/address/:hash/token-transfers',
    newPath: `${ PATHS.address_index }?tab=token_transfers`,
  },
  {
    oldPath: '/address/:hash/tokens',
    newPath: `${ PATHS.address_index }?tab=tokens`,
  },
  {
    oldPath: '/address/:hash/internal-transactions',
    newPath: `${ PATHS.address_index }?tab=internal_txns`,
  },
  {
    oldPath: '/address/:hash/coin-balances',
    newPath: `${ PATHS.address_index }?tab=coin_balance_history`,
  },
  {
    oldPath: '/address/:hash/validations',
    newPath: `${ PATHS.address_index }?tab=blocks_validated`,
  },
  {
    oldPath: '/address/:hash/tokens/:token_hash/token-transfers',
    newPath: `${ PATHS.address_index }?tab=token_transfers&token=:token_hash`,
  },
  // contract verification
  {
    oldPath: '/address/:hash/contract_verifications/new',
    newPath: `${ PATHS.address_contract_verification }`,
  },
  {
    oldPath: '/address/:hash/verify-via-flattened-code/new',
    newPath: `${ PATHS.address_contract_verification }?method=flatten_source_code`,
  },
  {
    oldPath: '/address/:hash/verify-via-standard-json-input/new',
    newPath: `${ PATHS.address_contract_verification }?method=standard_input`,
  },
  {
    oldPath: '/address/:hash/verify-via-metadata-json/new',
    newPath: `${ PATHS.address_contract_verification }?method=sourcify`,
  },
  {
    oldPath: '/address/:hash/verify-via-multi-part-files/new',
    newPath: `${ PATHS.address_contract_verification }?method=multi_part_file`,
  },
  {
    oldPath: '/address/:hash/verify-vyper-contract/new',
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
