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
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/block/countdown/[height]': {
    metadata: {
      title: {
        'default': '%chain_name% block %height% countdown',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/accounts': {
    metadata: {
      title: {
        'default': '%chain_name% top accounts',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
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
        'default': '%hash%, balances and analytics on the %chain_explorer_title%',
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
        'default': '%hash%, balances and analytics on the %chain_explorer_title%',
      },
    },
  },
  '/apps': {
    metadata: {
      title: {
        'default': `%chain_name% ${ dappEntityName }s - Explore top ${ dappEntityName }s`,
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/essential-dapps/[id]': {
    metadata: {
      title: {
        'default': '%id_formatted%',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/stats': {
    metadata: {
      title: {
        'default': '%chain_name% stats - %chain_name% network insights',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
    og: OG_ROOT_PAGE,
  },
  '/stats/[id]': {
    metadata: {
      title: {
        'default': '%chain_name% stats - %id% chart',
        enhanced: '%title% chart on %chain_name%',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/search-results': {
    metadata: {
      title: {
        'default': '%chain_name% search result for %q%',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/auth/profile': {
    metadata: {
      title: {
        'default': '%chain_name% - my profile',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/account/watchlist': {
    metadata: {
      title: {
        'default': '%chain_name% - watchlist',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/account/api-key': {
    metadata: {
      title: {
        'default': '%chain_name% - API keys',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/account/custom-abi': {
    metadata: {
      title: {
        'default': '%chain_name% - custom ABI',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/account/tag-address': {
    metadata: {
      title: {
        'default': '%chain_name% - private tags',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/account/verified-addresses': {
    metadata: {
      title: {
        'default': '%chain_name% - my verified addresses',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
    og: OG_ROOT_PAGE,
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
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/deposits': {
    metadata: {
      title: {
        'default': '%chain_name% deposits - track on %chain_name% explorer',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/batches/celestia/[height]/[commitment]': {
    metadata: {
      title: {
        'default': `%chain_name% ${ layerLabels.current } txn batch %height% %commitment%`,
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/blobs/[hash]': {
    metadata: {
      title: {
        'default': '%chain_name% blob %hash% details',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/ops': {
    metadata: {
      title: {
        'default': 'User operations on %chain_name% - %chain_name% explorer',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/404': {
    metadata: {
      title: {
        'default': '%chain_name% error - page not found',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/name-services': {
    metadata: {
      title: {
        'default': '%chain_name% name services - %chain_name% explorer',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/name-services/clusters/[name]': {
    metadata: {
      title: {
        'default': '%chain_name% %name% cluster details',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/validators': {
    metadata: {
      title: {
        'default': '%chain_name% validators list',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/epochs': {
    metadata: {
      title: {
        'default': '%chain_name% epochs',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/interop-messages': {
    metadata: {
      title: {
        'default': '%chain_name% interop messages',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
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
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/cc/tx/[hash]': {
    metadata: {
      title: {
        'default': '%chain_name% cross-chain transaction %hash% details',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/cross-chain-tx/[id]': {
    metadata: {
      title: {
        'default': '%chain_name% cross-chain transaction %id% details',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
      },
    },
  },
  '/ictt-users': {
    metadata: {
      title: {
        'default': '%chain_name% ICTT users',
      },
      description: {
        'default': DESCRIPTION_DEFAULT,
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
