// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Route } from 'nextjs-routes';

import { layerLabels } from 'src/features/rollup/common/utils/layer';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';

const dappEntityName = (getFeaturePayload(config.features.marketplace)?.titles.entity_name ?? '').toLowerCase();

const TEMPLATE_MAP: Record<Route['pathname'], string> = {
  '/': '%chain_name% blockchain explorer - View %chain_name% stats',
  '/txs': '%chain_name% transactions - %chain_name% explorer',
  '/internal-txs': '%chain_name% internal transactions - %chain_name% explorer',
  '/txs/kettle/[hash]': '%chain_name% kettle %hash% transactions',
  '/tx/[hash]': '%chain_name% transaction %hash%',
  '/blocks': '%chain_name% blocks',
  '/block/[height_or_hash]': '%chain_name% block %height_or_hash%',
  '/block/countdown': '%chain_name% block countdown index',
  '/block/countdown/[height]': '%chain_name% block %height% countdown',
  '/accounts': '%chain_name% top accounts',
  '/accounts/label/[slug]': '%chain_name% addresses search by label',
  '/address/[hash]': '%chain_name% address details for %hash%',
  '/verified-contracts': 'Verified %chain_name% contracts lookup - %chain_name% explorer',
  '/contract-verification': '%chain_name% verify contract',
  '/address/[hash]/contract-verification': '%chain_name% contract verification for %hash%',
  '/tokens': 'Tokens list - %chain_name% explorer',
  '/token/[hash]': '%chain_name% token details',
  '/token/[hash]/instance/[id]': '%chain_name% NFT instance',
  '/apps': `%chain_name% ${ dappEntityName }s - Explore top ${ dappEntityName }s`,
  '/apps/[id]': `%chain_name% marketplace ${ dappEntityName }`,
  '/apps/[id]/info': `%chain_name% marketplace ${ dappEntityName }`,
  '/essential-dapps/[id]': '%id_formatted%',
  '/stats': '%chain_name% stats - %chain_name% network insights',
  '/stats/[id]': '%chain_name% stats - %id% chart',
  '/uptime': '%chain_name% uptime',
  '/hot-contracts': '%chain_name% hot contracts',
  '/api-docs': '%chain_name% API docs - %chain_name% developer tools',
  '/search-results': '%chain_name% search result for %q%',
  '/auth/profile': '%chain_name% - my profile',
  '/account/merits': '%chain_name% - Merits',
  '/account/watchlist': '%chain_name% - watchlist',
  '/account/api-key': '%chain_name% - API keys',
  '/account/custom-abi': '%chain_name% - custom ABI',
  '/account/tag-address': '%chain_name% - private tags',
  '/account/verified-addresses': '%chain_name% - my verified addresses',
  '/public-tags/submit': '%chain_name% - public tag requests',
  '/withdrawals': '%chain_name% withdrawals - track on %chain_name% explorer',
  '/txn-withdrawals': `${ layerLabels.current } to ${ layerLabels.parent } message relayer`,
  '/visualize/sol2uml': '%chain_name% Solidity UML diagram',
  '/deposits': '%chain_name% deposits - track on %chain_name% explorer',
  '/output-roots': '%chain_name% output roots',
  '/dispute-games': '%chain_name% dispute games',
  '/batches': '%chain_name% txn batches',
  '/batches/[number]': `%chain_name% ${ layerLabels.current } txn batch %number%`,
  '/batches/celestia/[height]/[commitment]': `%chain_name% ${ layerLabels.current } txn batch %height% %commitment%`,
  '/blobs/[hash]': '%chain_name% blob %hash% details',
  '/ops': 'User operations on %chain_name% - %chain_name% explorer',
  '/op/[hash]': '%chain_name% user operation %hash%',
  '/404': '%chain_name% error - page not found',
  '/name-services': '%chain_name% name services - %chain_name% explorer',
  '/name-services/domains/[name]': '%chain_name% %name% domain details',
  '/name-services/clusters/[name]': '%chain_name% %name% cluster details',
  '/validators': '%chain_name% validators list',
  '/validators/[id]': '%chain_name% validator %id% details',
  '/epochs': '%chain_name% epochs',
  '/epochs/[number]': '%chain_name% epoch %number% details',
  '/gas-tracker': 'Track %chain_name% gas fees in %gwei_name%',
  '/mud-worlds': '%chain_name% MUD worlds list',
  '/token-transfers': '%chain_name% token transfers',
  '/advanced-filter': '%chain_name% advanced filter',
  '/pools': '%chain_name% DEX pools',
  '/pools/[hash]': '%chain_name% pool details',
  '/interop-messages': '%chain_name% interop messages',
  '/operations': '%chain_name% operations',
  '/operation/[id]': '%chain_name% operation %id%',
  '/cc/tx/[hash]': '%chain_name% cross-chain transaction %hash% details',
  '/cross-chain-tx/[id]': '%chain_name% cross-chain transaction %id% details',
  '/ictt-users': '%chain_name% ICTT users',

  // multichain routes
  '/chain/[chain_slug_or_id]/accounts/label/[slug]': '%chain_name% addresses search by label',
  '/chain/[chain_slug_or_id]/advanced-filter': '%chain_name% advanced filter',
  '/chain/[chain_slug_or_id]/block/[height_or_hash]': '%chain_name% block %height_or_hash% details',
  '/chain/[chain_slug_or_id]/block/countdown': '%chain_name% block countdown index',
  '/chain/[chain_slug_or_id]/block/countdown/[height]': '%chain_name% block %height% countdown',
  '/chain/[chain_slug_or_id]/op/[hash]': '%chain_name% user operation %hash% details',
  '/chain/[chain_slug_or_id]/token/[hash]': '%chain_name% token details',
  '/chain/[chain_slug_or_id]/token/[hash]/instance/[id]': '%chain_name% token NFT instance',
  '/chain/[chain_slug_or_id]/tx/[hash]': '%chain_name% transaction %hash% details',
  '/chain/[chain_slug_or_id]/visualize/sol2uml': '%chain_name% Solidity UML diagram',
  '/ecosystems': '%chain_name% ecosystems',

  // service routes, added only to make typescript happy
  '/login': '%chain_name% login',
  '/sprite': '%chain_name% SVG sprite',
  '/chakra': '%chain_name% Chakra UI showcase',
  '/api/metrics': '%chain_name% node API prometheus metrics',
  '/api/monitoring/invalid-api-schema': '%chain_name% node API prometheus metrics',
  '/api/log': '%chain_name% node API request log',
  '/api/tokens/[hash]/instances/[id]/media-type': '%chain_name% node API token instance media type',
  '/api/proxy': '%chain_name% node API proxy',
  '/api/csrf': '%chain_name% node API CSRF token',
  '/api/healthz': '%chain_name% node API health check',
  '/api/config': '%chain_name% node API app config',
};

const TEMPLATE_MAP_ENHANCED: Partial<Record<Route['pathname'], string>> = {
  '/token/[hash]': '%chain_name% %symbol_or_name% token details',
  '/token/[hash]/instance/[id]': '%chain_name% token instance for %symbol_or_name%',
  '/apps/[id]': '%chain_name% - %title%',
  '/apps/[id]/info': '%chain_name% - %title%',
  '/address/[hash]': '%chain_name% address details for %domain_name%',
  '/stats/[id]': '%title% chart on %chain_name%',
};

export function make(pathname: Route['pathname'], isEnriched = false) {
  const template = (isEnriched ? TEMPLATE_MAP_ENHANCED[pathname] : undefined) ?? TEMPLATE_MAP[pathname];
  const postfix = config.metadata.promoteBlockscoutInTitle ? ' | Blockscout' : '';

  return (template + postfix).trim();
}
