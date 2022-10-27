const BASE_PATH = require('./basePath');

const paths = {
  network_index: `${ BASE_PATH }`,
  watchlist: `${ BASE_PATH }/account/watchlist`,
  private_tags: `${ BASE_PATH }/account/tag_address`,
  public_tags: `${ BASE_PATH }/account/public_tags_request`,
  api_keys: `${ BASE_PATH }/account/api_key`,
  custom_abi: `${ BASE_PATH }/account/custom_abi`,
  profile: `${ BASE_PATH }/auth/profile`,
  txs: `${ BASE_PATH }/txs`,
  tx: `${ BASE_PATH }/tx/[id]`,
  blocks: `${ BASE_PATH }/blocks`,
  block: `${ BASE_PATH }/block/[id]`,
  tokens: `${ BASE_PATH }/tokens`,
  token_index: `${ BASE_PATH }/token/[hash]`,
  token_instance_item: `${ BASE_PATH }/token/[hash]/instance/[id]`,
  address_index: `${ BASE_PATH }/address/[id]`,
  address_contract_verification: `${ BASE_PATH }/address/[id]/contract_verifications/new`,
  apps: `${ BASE_PATH }/apps`,
  app_index: `${ BASE_PATH }/apps/[id]`,
  search_results: `${ BASE_PATH }/search-results`,
  other: `${ BASE_PATH }/search-results`,
  auth: `${ BASE_PATH }/auth/auth0`,
};

module.exports = paths;
