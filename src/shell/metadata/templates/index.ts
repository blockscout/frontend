// SPDX-License-Identifier: LicenseRef-Blockscout

/* eslint-disable max-len */

import type { Route } from 'nextjs-routes';

import { layerLabels } from 'src/features/rollup/common/utils/layer';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';

const dappEntityName = (getFeaturePayload(config.features.marketplace)?.titles.entity_name ?? '').toLowerCase();

interface RouteTemplateRecord {
  metadata: {
    title: {
      'default': string;
      enhanced?: string;
    };
    description: {
      'default': string;
      enhanced?: string;
    };
  };
  og?: {
    description: string;
    image: string;
  };
}

const OG_ROOT_PAGE = {
  description: config.metadata.og.description,
  image: config.metadata.og.imageUrl,
};

const DESCRIPTION_DEFAULT = 'Scan %chain_explorer_title% with Blockscout. Search transactions, verify smart contracts, analyze addresses, and access blockchain data through explorer APIs.';

export const TEMPLATE_MAP: Record<Route['pathname'], RouteTemplateRecord> = {
  '/': {
    metadata: {
      title: {
        'default': '%chain_name% blockchain explorer - View %chain_name% stats',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/txs': {
    metadata: {
      title: {
        'default': '%chain_name% transactions - %chain_name% explorer',
      },
      description: {
        'default': 'Browse the latest %chain_name% transactions on the %chain_explorer_title%. Track transaction status, fees, and details in real time.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/internal-txs': {
    metadata: {
      title: {
        'default': '%chain_name% internal transactions - %chain_name% explorer',
      },
      description: {
        'default': 'Browse the latest %chain_name% internal transactions on the %chain_explorer_title%. Track contract-to-contract value transfers and details.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/txs/kettle/[hash]': {
    metadata: {
      title: {
        'default': '%chain_name% kettle %hash% transactions',
      },
      description: {
        'default': 'View transactions for kettle %hash% on the %chain_explorer_title%.',
      },
    },
  },
  '/tx/[hash]': {
    metadata: {
      title: {
        'default': '%chain_name% transaction %hash%',
      },
      description: {
        'default': 'View transaction %hash% on %chain_explorer_title%',
      },
    },
  },
  '/blocks': {
    metadata: {
      title: {
        'default': '%chain_name% blocks',
      },
      description: {
        'default': 'Browse the latest %chain_name% blocks on the %chain_explorer_title%. Track block height, validators, gas used, and included transactions.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/block/[height_or_hash]': {
    metadata: {
      title: {
        'default': '%chain_name% block %height_or_hash%',
      },
      description: {
        'default': 'View the transactions, token transfers, and uncles for block %height_or_hash%',
      },
    },
  },
  '/block/countdown': {
    metadata: {
      title: {
        'default': '%chain_name% block countdown index',
      },
      description: {
        'default': 'Track upcoming %chain_name% block countdowns on the %chain_explorer_title% and estimate when a target block will be reached.',
      },
    },
  },
  '/block/countdown/[height]': {
    metadata: {
      title: {
        'default': '%chain_name% block %height% countdown',
      },
      description: {
        'default': 'Track the countdown to %chain_name% block %height% on the %chain_explorer_title% and estimate its arrival time.',
      },
    },
  },
  '/accounts': {
    metadata: {
      title: {
        'default': '%chain_name% top accounts',
      },
      description: {
        'default': 'Explore the top %chain_name% accounts by balance on the %chain_explorer_title%. View address holdings, rankings, and activity.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/accounts/label/[slug]': {
    metadata: {
      title: {
        'default': '%chain_name% addresses search by label',
      },
      description: {
        'default': 'Browse %chain_name% addresses tagged with the %slug% label on the %chain_explorer_title%.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/address/[hash]': {
    metadata: {
      title: {
        'default': '%chain_name% address details for %hash%',
        enhanced: '%chain_name% address details for %domain_name%',
      },
      description: {
        'default': 'View the account balance, transactions, and other data for %hash% on the %chain_explorer_title%',
        enhanced: 'View the account balance, transactions, and other data for %domain_name% on the %chain_explorer_title%',
      },
    },
  },
  '/verified-contracts': {
    metadata: {
      title: {
        'default': 'Verified %chain_name% contracts lookup - %chain_name% explorer',
      },
      description: {
        'default': 'Browse verified smart contracts on the %chain_explorer_title%. Search %chain_name% contract source code, ABIs, and compiler details.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/contract-verification': {
    metadata: {
      title: {
        'default': '%chain_name% verify contract',
      },
      description: {
        'default': 'Verify and publish your smart contract source code on the %chain_explorer_title% to make your %chain_name% contract transparent and trustworthy.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/address/[hash]/contract-verification': {
    metadata: {
      title: {
        'default': '%chain_name% contract verification for %hash%',
      },
      description: {
        'default': 'View the account balance, transactions, and other data for %hash% on the %chain_explorer_title%',
      },
    },
  },
  '/tokens': {
    metadata: {
      title: {
        'default': 'Tokens list - %chain_name% explorer',
      },
      description: {
        'default': 'Browse all tokens on the %chain_explorer_title%. Search %chain_name% ERC-20, ERC-721, and ERC-1155 tokens by name, symbol, or address.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/token/[hash]': {
    metadata: {
      title: {
        'default': '%chain_name% token details',
        enhanced: '%chain_name% %symbol_or_name% token details',
      },
      description: {
        'default': 'View token details, holders, transfers and analytics for %hash% on the %chain_explorer_title%',
        enhanced: '%symbol_or_name% token on %chain_name% — view holders, transfers, total supply and analytics on the %chain_explorer_title%',
      },
    },
  },
  '/token/[hash]/instance/[id]': {
    metadata: {
      title: {
        'default': '%chain_name% NFT instance',
        enhanced: '%chain_name% token instance for %symbol_or_name%',
      },
      description: {
        'default': 'View NFT instance %id% details, metadata and transfers for %hash% on the %chain_explorer_title%',
        enhanced: '%symbol_or_name% NFT instance %id% — view metadata, transfers and analytics on the %chain_explorer_title%',
      },
    },
  },
  '/apps': {
    metadata: {
      title: {
        'default': `%chain_name% ${ dappEntityName }s - Explore top ${ dappEntityName }s`,
      },
      description: {
        'default': `Discover and explore top %chain_name% ${ dappEntityName }s in the marketplace on the %chain_explorer_title%.`,
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/apps/[id]': {
    metadata: {
      title: {
        'default': `%chain_name% marketplace ${ dappEntityName }`,
        enhanced: '%chain_name% - %title%',
      },
      description: {
        'default': `Explore this %chain_name% ${ dappEntityName } in the marketplace on the %chain_explorer_title%.`,
      },
    },
  },
  '/apps/[id]/info': {
    metadata: {
      title: {
        'default': `%chain_name% marketplace ${ dappEntityName }`,
        enhanced: '%chain_name% - %title%',
      },
      description: {
        'default': `Explore this %chain_name% ${ dappEntityName } in the marketplace on the %chain_explorer_title%.`,
      },
    },
  },
  '/essential-dapps/[id]': {
    metadata: {
      title: {
        'default': '%id_formatted%',
      },
      description: {
        'default': 'Explore %id_formatted% on the %chain_explorer_title%.',
      },
    },
  },
  '/stats': {
    metadata: {
      title: {
        'default': '%chain_name% stats - %chain_name% network insights',
      },
      description: {
        'default': 'Explore %chain_name% network stats and charts on the %chain_explorer_title%. Track transactions, gas, accounts, and on-chain activity over time.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/stats/[id]': {
    metadata: {
      title: {
        'default': '%chain_name% stats - %id_formatted% chart',
        enhanced: '%title% chart on %chain_name%',
      },
      description: {
        'default': 'Explore the %id% chart with historical %chain_name% network data on the %chain_explorer_title%.',
        enhanced: '%description%',
      },
    },
  },
  '/uptime': {
    metadata: {
      title: {
        'default': '%chain_name% uptime',
      },
      description: {
        'default': 'Monitor %chain_name% network uptime and availability on the %chain_explorer_title%.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/hot-contracts': {
    metadata: {
      title: {
        'default': '%chain_name% hot contracts',
      },
      description: {
        'default': 'Discover the most active %chain_name% smart contracts on the %chain_explorer_title%, ranked by recent transaction activity.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/api-docs': {
    metadata: {
      title: {
        'default': '%chain_name% API docs - %chain_name% developer tools',
      },
      description: {
        'default': 'Explore the %chain_explorer_title% API documentation and access %chain_name% blockchain data programmatically through explorer APIs.',
      },
    },
  },
  '/search-results': {
    metadata: {
      title: {
        'default': '%chain_name% search result for %q%',
      },
      description: {
        'default': 'Search results for %q% on the %chain_explorer_title%. Find %chain_name% addresses, transactions, tokens, blocks, and more.',
      },
    },
  },
  '/public-tags/submit': {
    metadata: {
      title: {
        'default': '%chain_name% - public tag requests',
      },
      description: {
        'default': 'Propose a new public tag for your address, contract or set of contracts for your dApp. Our team will review and approve your submission. Public tags are incredible tool which helps users identify contracts and addresses.',
      },
    },
  },
  '/withdrawals': {
    metadata: {
      title: {
        'default': '%chain_name% withdrawals - track on %chain_name% explorer',
      },
      description: {
        'default': 'Track %chain_name% withdrawals on the %chain_explorer_title%. Monitor withdrawal status, amounts, and timestamps.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/txn-withdrawals': {
    metadata: {
      title: {
        'default': `${ layerLabels.current } to ${ layerLabels.parent } message relayer`,
      },
      description: {
        'default': `Relay ${ layerLabels.current } to ${ layerLabels.parent } messages and track withdrawal status on the %chain_explorer_title%.`,
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/visualize/sol2uml': {
    metadata: {
      title: {
        'default': '%chain_name% Solidity UML diagram',
      },
      description: {
        'default': 'Generate Solidity UML class diagrams for %chain_name% smart contracts on the %chain_explorer_title%.',
      },
    },
  },
  '/deposits': {
    metadata: {
      title: {
        'default': '%chain_name% deposits - track on %chain_name% explorer',
      },
      description: {
        'default': 'Track %chain_name% deposits on the %chain_explorer_title%. Monitor deposit status, amounts, and timestamps.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/output-roots': {
    metadata: {
      title: {
        'default': '%chain_name% output roots',
      },
      description: {
        'default': 'Browse %chain_name% output roots on the %chain_explorer_title% and track state commitments posted to the parent chain.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/dispute-games': {
    metadata: {
      title: {
        'default': '%chain_name% dispute games',
      },
      description: {
        'default': 'Browse %chain_name% dispute games on the %chain_explorer_title% and monitor fault proof challenges and their status.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/batches': {
    metadata: {
      title: {
        'default': '%chain_name% txn batches',
      },
      description: {
        'default': 'Browse %chain_name% transaction batches on the %chain_explorer_title%. Track batch status, size, and parent chain commitments.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/batches/[number]': {
    metadata: {
      title: {
        'default': `%chain_name% ${ layerLabels.current } txn batch %number%`,
      },
      description: {
        'default': 'View details for %chain_name% transaction batch %number% on the %chain_explorer_title%, including its transactions and status.',
      },
    },
  },
  '/batches/celestia/[height]/[commitment]': {
    metadata: {
      title: {
        'default': `%chain_name% ${ layerLabels.current } txn batch %height% %commitment%`,
      },
      description: {
        'default': 'View details for the %chain_name% transaction batch at Celestia height %height% on the %chain_explorer_title%.',
      },
    },
  },
  '/blobs/[hash]': {
    metadata: {
      title: {
        'default': '%chain_name% blob %hash% details',
      },
      description: {
        'default': 'View details for blob %hash% on the %chain_explorer_title%, including its data and associated transactions.',
      },
    },
  },
  '/ops': {
    metadata: {
      title: {
        'default': 'User operations on %chain_name% - %chain_name% explorer',
      },
      description: {
        'default': 'Browse %chain_name% user operations (ERC-4337) on the %chain_explorer_title%. Track account abstraction activity in real time.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/op/[hash]': {
    metadata: {
      title: {
        'default': '%chain_name% user operation %hash%',
      },
      description: {
        'default': 'View user operation %hash% on the %chain_explorer_title%, including its status, fees, and associated transaction.',
      },
    },
  },
  '/404': {
    metadata: {
      title: {
        'default': '%chain_name% error - page not found',
      },
      description: {
        'default': 'The page you are looking for could not be found on the %chain_explorer_title%.',
      },
    },
  },
  '/name-services': {
    metadata: {
      title: {
        'default': '%chain_name% name services - %chain_name% explorer',
      },
      description: {
        'default': 'Explore name services on the %chain_explorer_title%. Resolve %chain_name% domains and discover address-to-name mappings.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/name-services/domains/[name]': {
    metadata: {
      title: {
        'default': '%chain_name% %name% domain details',
      },
      description: {
        'default': 'View details for the %name% domain on the %chain_explorer_title%, including its resolved address, owner, and records.',
      },
    },
  },
  '/name-services/clusters/[name]': {
    metadata: {
      title: {
        'default': '%chain_name% %name% cluster details',
      },
      description: {
        'default': 'View details for the %name% cluster on the %chain_explorer_title%, including its members and resolved addresses.',
      },
    },
  },
  '/validators': {
    metadata: {
      title: {
        'default': '%chain_name% validators list',
      },
      description: {
        'default': 'Explore %chain_name% validators on the %chain_explorer_title%. View the validator set, blocks produced, and staking activity.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/validators/[id]': {
    metadata: {
      title: {
        'default': '%chain_name% validator %id% details',
      },
      description: {
        'default': 'View details for %chain_name% validator %id% on the %chain_explorer_title%, including blocks produced and performance.',
      },
    },
  },
  '/epochs': {
    metadata: {
      title: {
        'default': '%chain_name% epochs',
      },
      description: {
        'default': 'Browse %chain_name% epochs on the %chain_explorer_title%. Track epoch rewards, validator activity, and finalization.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/epochs/[number]': {
    metadata: {
      title: {
        'default': '%chain_name% epoch %number% details',
      },
      description: {
        'default': 'View details for %chain_name% epoch %number% on the %chain_explorer_title%, including rewards and validator activity.',
      },
    },
  },
  '/gas-tracker': {
    metadata: {
      title: {
        'default': 'Track %chain_name% gas fees in %gwei_name%',
      },
      description: {
        'default': 'Explore real-time %chain_explorer_title% gas fees with Blockscout\'s advanced gas fee tracker. Get accurate %gwei_name% estimates and track transaction costs live.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/mud-worlds': {
    metadata: {
      title: {
        'default': '%chain_name% MUD worlds list',
      },
      description: {
        'default': 'Browse MUD worlds on the %chain_explorer_title%. Explore on-chain %chain_name% autonomous worlds and their state.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/token-transfers': {
    metadata: {
      title: {
        'default': '%chain_name% token transfers',
      },
      description: {
        'default': 'Browse the latest %chain_name% token transfers on the %chain_explorer_title%. Track ERC-20, ERC-721, and ERC-1155 movements in real time.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/advanced-filter': {
    metadata: {
      title: {
        'default': '%chain_name% advanced filter',
      },
      description: {
        'default': 'Filter %chain_name% transactions and token transfers on the %chain_explorer_title% by address, asset, type, and time.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/pools': {
    metadata: {
      title: {
        'default': '%chain_name% DEX pools',
      },
      description: {
        'default': 'Explore %chain_name% DEX liquidity pools on the %chain_explorer_title%. View pool pairs, liquidity, and trading activity.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/pools/[hash]': {
    metadata: {
      title: {
        'default': '%chain_name% pool details',
      },
      description: {
        'default': 'View details for %chain_name% liquidity pool %hash% on the %chain_explorer_title%, including reserves, pairs, and activity.',
      },
    },
  },
  '/interop-messages': {
    metadata: {
      title: {
        'default': '%chain_name% interop messages',
      },
      description: {
        'default': 'Track cross-chain interop messages on the %chain_explorer_title%. Monitor %chain_name% message status and delivery.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/operations': {
    metadata: {
      title: {
        'default': '%chain_name% operations',
      },
      description: {
        'default': 'Browse %chain_name% operations on the %chain_explorer_title% and track on-chain activity in real time.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/operation/[id]': {
    metadata: {
      title: {
        'default': '%chain_name% operation %id%',
      },
      description: {
        'default': 'View details for %chain_name% operation %id% on the %chain_explorer_title%.',
      },
    },
  },
  '/cc/tx/[hash]': {
    metadata: {
      title: {
        'default': '%chain_name% cross-chain transaction %hash% details',
      },
      description: {
        'default': 'View cross-chain transaction %hash% on the %chain_explorer_title%, including its source, destination, and status.',
      },
    },
  },
  '/cross-chain-tx/[id]': {
    metadata: {
      title: {
        'default': '%chain_name% cross-chain transaction %id% details',
      },
      description: {
        'default': 'View cross-chain transaction %id% on the %chain_explorer_title%, including its source, destination, and status.',
      },
    },
  },
  '/ictt-users': {
    metadata: {
      title: {
        'default': '%chain_name% ICTT users',
      },
      description: {
        'default': 'Explore Interchain Token Transfer (ICTT) users on the %chain_explorer_title% and track cross-chain token activity.',
      },
    },
    og: OG_ROOT_PAGE,
  },

  // account routes (not indexed by search engines)
  '/auth/profile': {
    metadata: {
      title: {
        'default': '%chain_name% - my profile',
      },
      description: {
        'default': 'Manage your %chain_explorer_title% profile, account settings, and preferences.',
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/account/merits': {
    metadata: {
      title: {
        'default': '%chain_name% - Merits',
      },
      description: {
        'default': 'Track and manage your Merits on the %chain_explorer_title% and earn rewards for your %chain_name% activity.',
      },
    },
  },
  '/account/watchlist': {
    metadata: {
      title: {
        'default': '%chain_name% - watchlist',
      },
      description: {
        'default': 'Monitor your favorite %chain_name% addresses with the %chain_explorer_title% watchlist and get notified of balance changes and new transactions.',
      },
    },
  },
  '/account/api-key': {
    metadata: {
      title: {
        'default': '%chain_name% - API keys',
      },
      description: {
        'default': 'Create and manage your %chain_explorer_title% API keys to access %chain_name% blockchain data programmatically.',
      },
    },
  },
  '/account/custom-abi': {
    metadata: {
      title: {
        'default': '%chain_name% - custom ABI',
      },
      description: {
        'default': 'Add and manage custom ABIs on the %chain_explorer_title% to interact with unverified %chain_name% smart contracts.',
      },
    },
  },
  '/account/tag-address': {
    metadata: {
      title: {
        'default': '%chain_name% - private tags',
      },
      description: {
        'default': 'Create and manage private address tags on the %chain_explorer_title% to organize and label %chain_name% addresses.',
      },
    },
  },
  '/account/verified-addresses': {
    metadata: {
      title: {
        'default': '%chain_name% - my verified addresses',
      },
      description: {
        'default': 'Manage your verified addresses on the %chain_explorer_title% and prove ownership of your %chain_name% contracts.',
      },
    },
    og: OG_ROOT_PAGE,
  },

  // multichain routes
  '/chain/[chain_slug_or_id]/accounts/label/[slug]': {
    metadata: {
      title: {
        'default': '%chain_name% addresses search by label',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/chain/[chain_slug_or_id]/advanced-filter': {
    metadata: {
      title: {
        'default': '%chain_name% advanced filter',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/chain/[chain_slug_or_id]/block/[height_or_hash]': {
    metadata: {
      title: {
        'default': '%chain_name% block %height_or_hash% details',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/chain/[chain_slug_or_id]/block/countdown': {
    metadata: {
      title: {
        'default': '%chain_name% block countdown index',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/chain/[chain_slug_or_id]/block/countdown/[height]': {
    metadata: {
      title: {
        'default': '%chain_name% block %height% countdown',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/chain/[chain_slug_or_id]/op/[hash]': {
    metadata: {
      title: {
        'default': '%chain_name% user operation %hash% details',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/chain/[chain_slug_or_id]/token/[hash]': {
    metadata: {
      title: {
        'default': '%chain_name% token details',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/chain/[chain_slug_or_id]/token/[hash]/instance/[id]': {
    metadata: {
      title: {
        'default': '%chain_name% token NFT instance',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/chain/[chain_slug_or_id]/tx/[hash]': {
    metadata: {
      title: {
        'default': '%chain_name% transaction %hash% details',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/chain/[chain_slug_or_id]/visualize/sol2uml': {
    metadata: {
      title: {
        'default': '%chain_name% Solidity UML diagram',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/ecosystems': {
    metadata: {
      title: {
        'default': '%chain_name% ecosystems',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
    og: OG_ROOT_PAGE,
  },

  // service routes, added only to make typescript happy
  '/login': {
    metadata: {
      title: {
        'default': '%chain_name% login',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/sprite': {
    metadata: {
      title: {
        'default': '%chain_name% SVG sprite',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/chakra': {
    metadata: {
      title: {
        'default': '%chain_name% Chakra UI showcase',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/api/metrics': {
    metadata: {
      title: {
        'default': '%chain_name% node API prometheus metrics',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/api/monitoring/invalid-api-schema': {
    metadata: {
      title: {
        'default': '%chain_name% node API prometheus metrics',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/api/log': {
    metadata: {
      title: {
        'default': '%chain_name% node API request log',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/api/tokens/[hash]/instances/[id]/media-type': {
    metadata: {
      title: {
        'default': '%chain_name% node API token instance media type',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/api/proxy': {
    metadata: {
      title: {
        'default': '%chain_name% node API proxy',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/api/csrf': {
    metadata: {
      title: {
        'default': '%chain_name% node API CSRF token',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/api/healthz': {
    metadata: {
      title: {
        'default': '%chain_name% node API health check',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/api/config': {
    metadata: {
      title: {
        'default': '%chain_name% node API app config',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
};
