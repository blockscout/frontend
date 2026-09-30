// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Address3rdPartyWidget } from 'src/features/address-3rd-party-widgets/types/view';
import type { AlternativeExplorer } from 'src/features/alternative-explorers/types/client';
import type { BridgedTokenChain, TokenBridge } from 'src/features/bridged-tokens/types/client';
import type { StatsApiResourceNameRefetchInterval } from 'src/features/chain-stats/types/config';
import type { DeFiDropdownButtonText, DeFiDropdownItem } from 'src/features/defi-dropdown/types/client';
import type { TxExternalTxsConfig } from 'src/features/external-txs/types/client';
import type { GasRefuelProviderConfig } from 'src/features/get-gas-button/types/client';
import type { MultichainProviderConfig } from 'src/features/multichain-button/types/client';
import type { CustomLinksGroup } from 'src/shell/footer/types';
import type { NavigationPromoBannerConfig } from 'src/shell/navigation/types';
import type { FeaturedNetwork } from 'src/shell/top-bar/chain-menu/types';
import type { ContractCodeIde } from 'src/slices/contract/types/config';
import type { HighlightsBannerConfig } from 'src/slices/home/types/client';
import type { HeroBannerConfig } from 'src/slices/home/types/config';
import type { NftMarketplaceItem } from 'src/slices/token/types/client';

import type { FontFamily } from 'src/config/misc';

import { toEnvValue } from '../test-utils';

const featuredNetworks: Array<FeaturedNetwork> = [
  { title: 'Ethereum', url: 'https://eth.blockscout.com/', group: 'Mainnets', icon: 'https://example.com/logo.svg' },
  {
    title: 'Goerli',
    url: 'https://eth-goerli.blockscout.com/',
    group: 'Testnets',
    isActive: true,
    icon: 'https://example.com/logo.svg',
    invertIconInDarkMode: true,
  },
];

const footerLinks: Array<CustomLinksGroup> = [
  { title: 'Foo', links: [ { text: 'Home', url: 'https://example.com' } ] },
  {
    title: 'Developers',
    links: [ { text: 'Develop', url: 'https://example.com', iconUrl: [ 'https://example.com/a.jpg', 'https://example.com/b.svg' ] } ],
  },
];

const highlights: Array<HighlightsBannerConfig> = [
  { title: 'Duck Deep into Transactions', description: 'Explore and track all blockchain transactions', page_path: '/txs' },
  { title: 'Capybara Hot Spring Pools', description: 'Monitor liquidity and staking pools', is_pinned: true, redirect_url: 'https://example.com' },
];

const address3rdPartyWidgets: Record<string, Address3rdPartyWidget> = {
  'widget-1': {
    name: 'Widget 1',
    url: 'https://example.com/widget-1/{address}',
    icon: 'https://example.com/icon.svg',
    title: 'Widget 1',
    valuePath: 'result.value',
    pages: [ 'eoa', 'contract', 'token' ],
  },
};

const heroBanner: HeroBannerConfig = {
  background: [ 'lightpink' ],
  text_color: [ 'deepskyblue', 'white' ],
  border: [ '3px solid black' ],
  search: {
    background: [ 'white', 'rgb(26,32,44)' ],
    border_width: [ '2px', '2px' ],
    border_color: {
      _empty: [ 'rgb(203,213,224)', 'rgb(74,85,104)' ],
      _hover: [ 'rgb(66,153,225)', 'rgb(99,179,237)' ],
      _focus: [ 'rgb(49,130,206)', 'rgb(43,108,176)' ],
      _filled: [ 'rgb(160,174,192)', 'rgb(113,128,150)' ],
    },
  },
};

const multichainHeroBanner: HeroBannerConfig = {
  background: [ 'linear-gradient(90deg, rgb(232, 52, 53) 0%, rgb(139, 28, 232) 100%)' ],
  text_color: [ 'rgb(255, 255, 255)' ],
  text: 'Duck migration observer',
  search: {
    border_width: [ '0px' ],
    border_color: { _focus: [ 'deeppink' ] },
  },
};

const bridgedTokensChains: Array<BridgedTokenChain> = [ { id: '1', title: 'Ethereum', short_title: 'ETH', base_url: 'https://example.com' } ];
const bridgedTokensBridges: Array<TokenBridge> = [ { type: 'omni', title: 'OmniBridge', short_title: 'OMNI' } ];

const contractCodeIdes: Array<ContractCodeIde> = [
  { title: 'Remix IDE', url: 'https://remix.blockscout.com/?address={hash}&blockscout={domain}', icon_url: 'https://example.com/icon.svg' },
];

const fontHeading: FontFamily = { name: 'Montserrat', url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap' };
const fontBody: FontFamily = { name: 'Raleway', url: 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&display=swap' };

const networkExplorers: Array<AlternativeExplorer> = [
  { title: 'Explorer', baseUrl: 'https://example.com/', paths: { tx: '/tx', address: '/address', token: '/token', block: '/block', blob: '/blob' } },
];

const nftMarketplaces: Array<NftMarketplaceItem> = [
  {
    name: 'NFT Marketplace',
    collection_url: 'https://example.com/{hash}',
    instance_url: 'https://example.com/{hash}/{id}',
    logo_url: 'https://example.com/logo.png',
  },
];

const defiDropdownItems: Array<DeFiDropdownItem> = [
  { text: 'Swap', icon: 'swap', dappId: 'uniswap' },
  { text: 'Payment link', icon: 'payment_link', url: 'https://example.com' },
];
const defiDropdownButtonText: DeFiDropdownButtonText = { desktop: 'Blockscout DeFi', mobile: 'DeFi' };

const multichainBalanceProviders: Array<MultichainProviderConfig> = [
  { name: 'zerion', url_template: 'https://app.zerion.io/{address}/overview', logo: 'https://example.com/zerion.svg' },
];

const gasRefuelProvider: GasRefuelProviderConfig = {
  name: 'Need gas?',
  dapp_id: 'smol-refuel',
  url_template: 'https://smolrefuel.com/?outboundChain={chainId}&partner=blockscout',
  logo: 'https://example.com/smolrefuel.png',
};

const navigationPromoBanner: NavigationPromoBannerConfig = {
  img_url: 'https://example.com/promo.svg',
  text: 'Promo text',
  bg_color: { light: 'rgb(250, 245, 255)', dark: 'rgb(68, 51, 122)' },
  text_color: { light: 'rgb(107, 70, 193)', dark: 'rgb(233, 216, 253)' },
  link_url: 'https://example.com',
};

const statsRefetchInterval: Record<StatsApiResourceNameRefetchInterval, number> = {
  'stats:counters': 10_000,
  'stats:pages_main': 10_000,
};

export const txExternalTxsConfig: TxExternalTxsConfig = {
  chain_name: 'Ethereum',
  chain_logo_url: 'https://example.com/logo.png',
  explorer_url_template: 'https://example.com/tx/{hash}',
};

export const singleChainConfig: Record<string, string> = {
  NEXT_PUBLIC_API_HOST: 'blockscout.com',
  NEXT_PUBLIC_APP_HOST: 'localhost',
  NEXT_PUBLIC_NETWORK_ID: '1',
  NEXT_PUBLIC_NETWORK_NAME: 'Testnet',
  NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN: 'https://rollbar.com',
  NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED: 'true',
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: 'xxx',
  NEXT_PUBLIC_WALLET_CONNECT_FEATURED_WALLET_IDS: toEnvValue([ 'xxx' ]),
  NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY: 'xxx',
  NEXT_PUBLIC_GOOGLE_ANALYTICS_PROPERTY_ID: 'UA-XXXXXX-X',
  NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN: 'xxx',
  NEXT_PUBLIC_USERCENTRICS_CONFIG: JSON.stringify({ settingsId: 'xxx', rulesetId: 'xxx' }),
  NEXT_PUBLIC_USERCENTRICS_DRAFT: 'true',
  NEXT_PUBLIC_MIXPANEL_CONFIG_OVERRIDES: toEnvValue({ record_sessions_percent: 0.5, record_heatmap_data: true }),
  NEXT_PUBLIC_GROWTH_BOOK_CLIENT_KEY: 'xxx',
  NEXT_PUBLIC_AD_TEXT_PROVIDER: 'sevio',
  NEXT_PUBLIC_AD_BANNER_PROVIDER: 'slise',
  NEXT_PUBLIC_ADMIN_SERVICE_API_HOST: 'https://example.com',
  NEXT_PUBLIC_ADMIN_RS_INSTANCE_ID: '420:duck',
  NEXT_PUBLIC_API_BASE_PATH: '/',
  NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL: 'ws',
  NEXT_PUBLIC_APP_ENV: 'development',
  NEXT_PUBLIC_APP_PORT: '3000',
  NEXT_PUBLIC_APP_PROTOCOL: 'http',
  NEXT_PUBLIC_BRIDGED_TOKENS_CHAINS: toEnvValue(bridgedTokensChains),
  NEXT_PUBLIC_BRIDGED_TOKENS_BRIDGES: toEnvValue(bridgedTokensBridges),
  NEXT_PUBLIC_COLOR_THEMES: toEnvValue([ 'dim', 'dark' ]),
  NEXT_PUBLIC_COLOR_THEME_DEFAULT: 'dim',
  NEXT_PUBLIC_CONTRACT_CODE_IDES: toEnvValue(contractCodeIdes),
  NEXT_PUBLIC_CONTRACT_INFO_API_HOST: 'https://example.com',
  NEXT_PUBLIC_CONTRACT_INFO_INSTANCE_ID: '420:duck',
  NEXT_PUBLIC_DATA_AVAILABILITY_ENABLED: 'true',
  NEXT_PUBLIC_FEATURED_NETWORKS: JSON.stringify(featuredNetworks),
  NEXT_PUBLIC_FEATURED_NETWORKS_ALL_LINK: 'https://example.com',
  NEXT_PUBLIC_FEATURED_NETWORKS_MODE: 'list',
  NEXT_PUBLIC_NAVIGATION_HIGHLIGHTED_ROUTES: toEnvValue([ '/accounts', '/apps' ]),
  NEXT_PUBLIC_NAVIGATION_LAYOUT: 'horizontal',
  NEXT_PUBLIC_FONT_FAMILY_HEADING: toEnvValue(fontHeading),
  NEXT_PUBLIC_FONT_FAMILY_BODY: toEnvValue(fontBody),
  NEXT_PUBLIC_FOOTER_LINKS: JSON.stringify(footerLinks),
  NEXT_PUBLIC_HELIA_VERIFIED_FETCH_ENABLED: 'false',
  NEXT_PUBLIC_HIDE_INDEXING_ALERT_BLOCKS: 'false',
  NEXT_PUBLIC_HIDE_INDEXING_ALERT_INT_TXS: 'false',
  NEXT_PUBLIC_HIDE_NATIVE_COIN_PRICE: 'false',
  NEXT_PUBLIC_MAX_CONTENT_WIDTH_ENABLED: 'false',
  NEXT_PUBLIC_HOMEPAGE_CHARTS: toEnvValue([ 'daily_txs' ]),
  NEXT_PUBLIC_HOMEPAGE_STATS: toEnvValue([ 'total_blocks', 'average_block_time', 'total_txs', 'wallet_addresses', 'gas_tracker', 'current_epoch' ]),
  NEXT_PUBLIC_HOMEPAGE_HERO_BANNER_CONFIG: toEnvValue(heroBanner),
  NEXT_PUBLIC_HOT_CONTRACTS_ENABLED: 'true',
  NEXT_PUBLIC_GAS_TRACKER_ENABLED: 'true',
  NEXT_PUBLIC_GAS_TRACKER_UNITS: toEnvValue([ 'gwei' ]),
  NEXT_PUBLIC_IS_TESTNET: 'true',
  NEXT_PUBLIC_MAINTENANCE_ALERT_MESSAGE: '<a href="#">Hello</a>',
  NEXT_PUBLIC_METADATA_SERVICE_API_HOST: 'https://example.com',
  NEXT_PUBLIC_METASUITES_ENABLED: 'true',
  NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS: '18',
  NEXT_PUBLIC_NETWORK_CURRENCY_NAME: 'Ether',
  NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL: 'ETH',
  NEXT_PUBLIC_NETWORK_EXPLORERS: toEnvValue(networkExplorers),
  NEXT_PUBLIC_NETWORK_SECONDARY_COIN_SYMBOL: 'GNO',
  NEXT_PUBLIC_NETWORK_MULTIPLE_GAS_CURRENCIES: 'true',
  NEXT_PUBLIC_NETWORK_ICON: 'https://example.com/icon.png',
  NEXT_PUBLIC_NETWORK_ICON_DARK: 'https://example.com/icon.png',
  NEXT_PUBLIC_NETWORK_LOGO: 'https://example.com/logo.png',
  NEXT_PUBLIC_NETWORK_LOGO_DARK: 'https://example.com/logo.png',
  NEXT_PUBLIC_NETWORK_RPC_URL: 'https://example.com',
  NEXT_PUBLIC_NETWORK_SHORT_NAME: 'Test',
  NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE: 'validation',
  NEXT_PUBLIC_OG_DESCRIPTION: 'Hello world!',
  NEXT_PUBLIC_OG_IMAGE_URL: 'https://example.com/image.png',
  NEXT_PUBLIC_OG_ENHANCED_DATA_ENABLED: 'true',
  NEXT_PUBLIC_SEO_ENHANCED_DATA_ENABLED: 'true',
  NEXT_PUBLIC_OTHER_LINKS: toEnvValue([ { url: 'https://blockscout.com', text: 'Blockscout' } ]),
  NEXT_PUBLIC_PROMOTE_BLOCKSCOUT_IN_TITLE: 'true',
  NEXT_PUBLIC_SAFE_TX_SERVICE_URL: 'https://safe-transaction-mainnet.safe.global',
  NEXT_PUBLIC_STATS_API_HOST: 'https://example.com',
  NEXT_PUBLIC_STATS_API_BASE_PATH: '/',
  NEXT_PUBLIC_STATS_API_REFETCH_INTERVAL: toEnvValue(statsRefetchInterval),
  NEXT_PUBLIC_PRO_API_SUPPORTED: 'true',
  NEXT_PUBLIC_USE_NEXT_JS_PROXY: 'false',
  NEXT_PUBLIC_VIEWS_ADDRESS_IDENTICON_TYPE: 'gradient_avatar',
  NEXT_PUBLIC_VIEWS_ADDRESS_FORMAT: toEnvValue([ 'base16' ]),
  NEXT_PUBLIC_VIEWS_ADDRESS_HIDDEN_VIEWS: toEnvValue([ 'top_accounts' ]),
  NEXT_PUBLIC_VIEWS_ADDRESS_NATIVE_TOKEN_ADDRESS: '0x471EcE3750Da237f93B8E339c536989b8978a438',
  NEXT_PUBLIC_VIEWS_CONTRACT_EXTRA_VERIFICATION_METHODS: toEnvValue([ 'solidity-hardhat', 'solidity-foundry' ]),
  NEXT_PUBLIC_VIEWS_BLOCK_HIDDEN_FIELDS: toEnvValue([ 'burnt_fees', 'total_reward' ]),
  NEXT_PUBLIC_VIEWS_BLOCK_PENDING_UPDATE_ALERT_ENABLED: 'false',
  NEXT_PUBLIC_VIEWS_NFT_MARKETPLACES: toEnvValue(nftMarketplaces),
  NEXT_PUBLIC_VIEWS_TX_ADDITIONAL_FIELDS: toEnvValue([ 'fee_per_gas', 'set_max_gas_limit' ]),
  NEXT_PUBLIC_VIEWS_TX_HIDDEN_FIELDS: toEnvValue([ 'value', 'fee_currency', 'gas_price', 'tx_fee', 'gas_fees', 'burnt_fees' ]),
  NEXT_PUBLIC_VISUALIZE_API_HOST: 'https://example.com',
  NEXT_PUBLIC_VISUALIZE_API_BASE_PATH: 'https://example.com',
  NEXT_PUBLIC_WEB3_DISABLE_ADD_TOKEN_TO_WALLET: 'false',
  NEXT_PUBLIC_WEB3_WALLETS: toEnvValue([ 'coinbase', 'metamask', 'token_pocket' ]),
  NEXT_PUBLIC_VALIDATORS_CHAIN_TYPE: 'stability',
  NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS: toEnvValue(defiDropdownItems),
  NEXT_PUBLIC_DEFI_DROPDOWN_BUTTON_TEXT: toEnvValue(defiDropdownButtonText),
  NEXT_PUBLIC_MULTICHAIN_BALANCE_PROVIDER_CONFIG: toEnvValue(multichainBalanceProviders),
  NEXT_PUBLIC_GAS_REFUEL_PROVIDER_CONFIG: toEnvValue(gasRefuelProvider),
  NEXT_PUBLIC_REWARDS_SERVICE_API_HOST: 'https://example.com',
  NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS: toEnvValue([ 'widget-1', 'widget-2' ]),
  NEXT_PUBLIC_ADDRESS_3RD_PARTY_WIDGETS_CONFIG_URL: JSON.stringify(address3rdPartyWidgets),
  NEXT_PUBLIC_NAVIGATION_PROMO_BANNER_CONFIG: toEnvValue(navigationPromoBanner),
  NEXT_PUBLIC_FLASHBLOCKS_SOCKET_URL: 'wss://example.com/ws',
  NEXT_PUBLIC_FLASHBLOCKS_NAME: 'flashblock',
  NEXT_PUBLIC_HOMEPAGE_HIGHLIGHTS_CONFIG: JSON.stringify(highlights),
  NEXT_PUBLIC_NAME_SERVICE_API_HOST: 'https://example.com',
  NEXT_PUBLIC_NAME_SERVICE_PROTOCOLS: toEnvValue([ 'duck', 'goose' ]),
  NEXT_PUBLIC_CLUSTERS_API_HOST: 'https://example.com',
  NEXT_PUBLIC_CLUSTERS_CDN_URL: 'https://example.com',
};

export const multichainConfig: Record<string, string> = {
  NEXT_PUBLIC_APP_HOST: 'localhost',
  NEXT_PUBLIC_MULTICHAIN_AGGREGATOR_API_HOST: 'https://example.com',
  NEXT_PUBLIC_MULTICHAIN_STATS_API_HOST: 'http://example.com',
  NEXT_PUBLIC_MULTICHAIN_ENABLED: 'true',
  NEXT_PUBLIC_MULTICHAIN_CLUSTER: 'test',
  NEXT_PUBLIC_HOMEPAGE_CHARTS: toEnvValue([ 'daily_txs', 'coin_price', 'market_cap' ]),
  NEXT_PUBLIC_HOMEPAGE_STATS: toEnvValue([ 'total_txs', 'wallet_addresses' ]),
  NEXT_PUBLIC_API_DOCS_TABS: '[]',
  NEXT_PUBLIC_FEATURED_NETWORKS: JSON.stringify(featuredNetworks),
  NEXT_PUBLIC_FOOTER_LINKS: JSON.stringify(footerLinks),
  NEXT_PUBLIC_HOMEPAGE_HERO_BANNER_CONFIG: toEnvValue(multichainHeroBanner),
  NEXT_PUBLIC_MULTICHAIN_BALANCE_PROVIDER_CONFIG: toEnvValue(multichainBalanceProviders),
  NEXT_PUBLIC_NETWORK_ICON: 'http://example.com',
  NEXT_PUBLIC_NETWORK_ICON_DARK: 'http://example.com',
  NEXT_PUBLIC_NETWORK_LOGO: 'http://example.com',
  NEXT_PUBLIC_NETWORK_LOGO_DARK: 'http://example.com',
  NEXT_PUBLIC_NETWORK_NAME: 'Multichain',
  NEXT_PUBLIC_NETWORK_SHORT_NAME: 'Multichain',
  NEXT_PUBLIC_OG_IMAGE_URL: 'http://example.com',
  NEXT_PUBLIC_GAS_TRACKER_ENABLED: 'false',
  NEXT_PUBLIC_HIDE_INDEXING_ALERT_BLOCKS: 'true',
  NEXT_PUBLIC_HIDE_INDEXING_ALERT_INT_TXS: 'true',
  NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED: 'false',
  NEXT_PUBLIC_IS_TESTNET: 'true',
  NEXT_PUBLIC_USE_NEXT_JS_PROXY: 'true',
  NEXT_PUBLIC_HAS_USER_OPS: 'true',
  NEXT_PUBLIC_ADVANCED_FILTER_ENABLED: 'false',
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: 'xxx',
  NEXT_PUBLIC_GOOGLE_ANALYTICS_PROPERTY_ID: 'xxx',
  NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN: 'xxx',
  NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN: 'xxx',
};
