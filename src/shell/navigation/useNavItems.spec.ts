// @vitest-environment jsdom

import type { NavGroupItem, NavItem } from './types';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, renderHook } from 'vitest/lib';
import withEnvs from 'vitest/utils/mockEnvs';

type Envs = Array<[ string, string ]>;
type MainNavItem = NavItem | NavGroupItem;
type TextOutline = string | [ string, Array<string> | Array<Array<string>> ];

interface NavItems {
  readonly mainNavItems: Array<MainNavItem>;
  readonly accountNavItems: Array<NavItem>;
}

const OPTIMISTIC_ROLLUP_FULL: Envs = [
  ...ENVS_MAP.optimisticRollup,
  [ 'NEXT_PUBLIC_ROLLUP_OUTPUT_ROOTS_ENABLED', 'true' ],
  [ 'NEXT_PUBLIC_INTEROP_ENABLED', 'true' ],
];

const BEACON_CHAIN_WITHDRAWALS_ONLY: Envs = [
  ...ENVS_MAP.beaconChain,
  [ 'NEXT_PUBLIC_BEACON_CHAIN_WITHDRAWALS_ONLY', 'true' ],
];

const ALL_OPTIONAL_ITEMS: Envs = [
  ...ENVS_MAP.userOps,
  ...ENVS_MAP.nameService,
  ...ENVS_MAP.verifiedAddresses,
  ...ENVS_MAP.celo,
  [ 'NEXT_PUBLIC_DEX_POOLS_ENABLED', 'true' ],
  [ 'NEXT_PUBLIC_VALIDATORS_CHAIN_TYPE', 'stability' ],
  [ 'NEXT_PUBLIC_HOT_CONTRACTS_ENABLED', 'true' ],
  [ 'NEXT_PUBLIC_MEGA_ETH_SOCKET_URL_METRICS', 'wss://localhost:3200' ],
  [ 'NEXT_PUBLIC_METADATA_SERVICE_API_HOST', 'http://localhost:3007' ],
  [ 'NEXT_PUBLIC_METADATA_ADDRESS_TAGS_UPDATE_ENABLED', 'true' ],
  [ 'NEXT_PUBLIC_OTHER_LINKS', '[{"url":"https://duck.io","text":"Duck"}]' ],
  [ 'NEXT_PUBLIC_MARKETPLACE_ENABLED', 'true' ],
];

const NO_OPTIONAL_ITEMS: Envs = [
  ...ENVS_MAP.stabilityEnvs,
  ...ENVS_MAP.noAccount,
  [ 'NEXT_PUBLIC_INTERNAL_TXS_ENABLED', 'false' ],
  [ 'NEXT_PUBLIC_API_DOCS_TABS', '[]' ],
  [ 'NEXT_PUBLIC_STATS_API_HOST', '' ],
  [ 'NEXT_PUBLIC_GAS_TRACKER_ENABLED', 'false' ],
];

const VALIDATORS: Envs = [ [ 'NEXT_PUBLIC_VALIDATORS_CHAIN_TYPE', 'stability' ] ];

const DEFAULT_BLOCKCHAIN_ITEMS = [
  'Transactions', 'Internal transactions', 'Blocks', 'Top accounts', 'Verified contracts', 'Name services lookup',
];
const ROLLUP_ACCOUNTS_COLUMN = [ 'Top accounts', 'Verified contracts', 'Name services lookup' ];
const ROLLUP_TXS_COLUMN = [ 'Transactions', 'Internal transactions', 'Deposits (L1→L2)', 'Withdrawals (L2→L1)' ];

const isGroup = (item: MainNavItem): item is NavGroupItem => 'subItems' in item;

const loadNavItems = async(envs: Envs, pathname = '/', query: Record<string, string> = {}): Promise<NavItems> =>
  withEnvs(envs, async() => {
    const [ { routerStandIn }, { 'default': useNavItems } ] = await Promise.all([
      import('vitest/utils/routerStandIn'),
      import('./useNavItems'),
    ]);
    routerStandIn.reset({ pathname, query });
    const { result } = renderHook(() => useNavItems(), { wrapper: routerStandIn.wrapper });
    return result.current;
  });

const toTexts = (items: Array<NavItem> | Array<Array<NavItem>>): Array<string> | Array<Array<string>> =>
  items.map((item) => Array.isArray(item) ? item.map(({ text }) => text) : item.text) as Array<string> | Array<Array<string>>;

const toOutline = (items: Array<MainNavItem>): Array<TextOutline> =>
  items.map((item) => isGroup(item) ? [ item.text, toTexts(item.subItems) ] : item.text);

const getSubItemTexts = ({ mainNavItems }: NavItems, groupText: string): Array<string> | Array<Array<string>> | undefined => {
  const group = mainNavItems.find((item) => isGroup(item) && item.text === groupText);
  return group && isGroup(group) ? toTexts(group.subItems) : undefined;
};

const getLeafItems = ({ mainNavItems, accountNavItems }: NavItems): Array<NavItem> => [
  ...mainNavItems.flatMap((item) => isGroup(item) ? item.subItems.flat() : [ item ]),
  ...accountNavItems,
];

const findLeafItem = (navItems: NavItems, text: string): NavItem | undefined =>
  getLeafItems(navItems).find((item) => item.text === text);

const getActiveTexts = ({ mainNavItems, accountNavItems }: NavItems): Array<string> => [
  ...mainNavItems.flatMap((item) => isGroup(item) ? [ item, ...item.subItems.flat() ] : [ item ]),
  ...accountNavItems,
]
  .filter((item) => 'isActive' in item && item.isActive)
  .map(({ text }) => text);

afterEach(cleanup);

describe('useNavItems', () => {
  describe('main navigation structure', () => {
    it('lists the core explorer sections on a chain with the default config', async() => {
      const navItems = await loadNavItems([]);

      expect(toOutline(navItems.mainNavItems)).toEqual([
        [ 'Blockchain', DEFAULT_BLOCKCHAIN_ITEMS ],
        [ 'Tokens', [ 'Tokens', 'Token transfers' ] ],
        [ 'Charts & stats', [ 'Chain stats', 'Gas tracker' ] ],
        'API',
        [ 'Other', [ 'Verify contract' ] ],
      ]);
    });

    it('adds every optional item when its feature is enabled', async() => {
      const navItems = await loadNavItems(ALL_OPTIONAL_ITEMS);

      expect(toOutline(navItems.mainNavItems)).toEqual([
        [ 'Blockchain', [
          'Transactions', 'Internal transactions', 'User operations', 'Blocks', 'Epochs',
          'Top accounts', 'Validators', 'Verified contracts', 'Name services lookup',
        ] ],
        [ 'Tokens', [ 'Tokens', 'Token transfers', 'DEX tracker' ] ],
        'Dapps',
        [ 'Charts & stats', [ 'Chain stats', 'Uptime', 'Hot contracts', 'Gas tracker' ] ],
        'API',
        [ 'Other', [ 'Verify contract', 'Submit public tag', 'Duck' ] ],
      ]);
    });

    it('drops the items, the stats group and the API link whose features are disabled', async() => {
      const navItems = await loadNavItems(NO_OPTIONAL_ITEMS);

      expect(toOutline(navItems.mainNavItems)).toEqual([
        [ 'Blockchain', [ 'Transactions', 'Blocks', 'Verified contracts', 'Name services lookup' ] ],
        [ 'Tokens', [ 'Tokens', 'Token transfers' ] ],
        [ 'Other', [ 'Verify contract' ] ],
      ]);
    });

    it.each<[ string, Envs, Array<Array<string>> ]>([
      [ 'an optimistic rollup with fault proofs', ENVS_MAP.optimisticRollup, [
        ROLLUP_TXS_COLUMN,
        [ 'Blocks', 'Txn batches', 'Dispute games' ],
        ROLLUP_ACCOUNTS_COLUMN,
      ] ],
      [ 'an optimistic rollup with output roots and interop', OPTIMISTIC_ROLLUP_FULL, [
        [ ...ROLLUP_TXS_COLUMN, 'Interop messages' ],
        [ 'Blocks', 'Txn batches', 'Dispute games', 'Output roots' ],
        ROLLUP_ACCOUNTS_COLUMN,
      ] ],
      [ 'an optimistic rollup on Celo', [ ...ENVS_MAP.optimisticRollup, ...ENVS_MAP.celo ], [
        ROLLUP_TXS_COLUMN,
        [ 'Blocks', 'Epochs', 'Dispute games' ],
        ROLLUP_ACCOUNTS_COLUMN,
      ] ],
      [ 'an optimistic rollup with user operations and validators', [ ...ENVS_MAP.optimisticRollup, ...ENVS_MAP.userOps, ...VALIDATORS ], [
        ROLLUP_TXS_COLUMN,
        [ 'Blocks', 'Txn batches', 'Dispute games' ],
        [ 'User operations', 'Top accounts', 'Validators', 'Verified contracts', 'Name services lookup' ],
      ] ],
      [ 'an arbitrum rollup', ENVS_MAP.arbitrumRollup, [
        ROLLUP_TXS_COLUMN,
        [ 'Blocks', 'Txn batches' ],
        ROLLUP_ACCOUNTS_COLUMN,
      ] ],
      [ 'a scroll rollup', ENVS_MAP.scrollRollup, [
        ROLLUP_TXS_COLUMN,
        [ 'Blocks', 'Txn batches' ],
        ROLLUP_ACCOUNTS_COLUMN,
      ] ],
      [ 'a shibarium rollup', ENVS_MAP.shibariumRollup, [
        ROLLUP_TXS_COLUMN,
        [ 'Blocks', 'Top accounts', 'Verified contracts', 'Name services lookup' ],
      ] ],
      [ 'a shibarium rollup with user operations', [ ...ENVS_MAP.shibariumRollup, ...ENVS_MAP.userOps ], [
        ROLLUP_TXS_COLUMN,
        [ 'Blocks', 'User operations', 'Top accounts', 'Verified contracts', 'Name services lookup' ],
      ] ],
      [ 'a zkSync rollup', ENVS_MAP.zkSyncRollup, [
        [ 'Transactions', 'Internal transactions', 'Blocks', 'Txn batches' ],
        ROLLUP_ACCOUNTS_COLUMN,
      ] ],
      [ 'a zkSync rollup with user operations and validators', [ ...ENVS_MAP.zkSyncRollup, ...ENVS_MAP.userOps, ...VALIDATORS ], [
        [ 'Transactions', 'Internal transactions', 'User operations', 'Blocks', 'Txn batches' ],
        [ 'Top accounts', 'Validators', 'Verified contracts', 'Name services lookup' ],
      ] ],
    ])('splits the Blockchain group into columns on %s', async(_, envs, expected) => {
      const navItems = await loadNavItems(envs);

      expect(getSubItemTexts(navItems, 'Blockchain')).toEqual(expected);
    });

    it.each<[ string, Envs, Array<string> ]>([
      [ 'ZetaChain', ENVS_MAP.zetaChain, [
        'Transactions', 'Internal transactions', 'Cross-chain transactions', 'Blocks', 'Top accounts', 'Verified contracts', 'Name services lookup',
      ] ],
      [ 'TAC', ENVS_MAP.tac, [
        'Transactions', 'Operations', 'Internal transactions', 'Blocks', 'Top accounts', 'Verified contracts', 'Name services lookup',
      ] ],
      [ 'a beacon chain', ENVS_MAP.beaconChain, [ ...DEFAULT_BLOCKCHAIN_ITEMS, 'Deposits', 'Withdrawals' ] ],
      [ 'a beacon chain with withdrawals only', BEACON_CHAIN_WITHDRAWALS_ONLY, [ ...DEFAULT_BLOCKCHAIN_ITEMS, 'Withdrawals' ] ],
    ])('keeps the Blockchain group flat on %s', async(_, envs, expected) => {
      const navItems = await loadNavItems(envs);

      expect(getSubItemTexts(navItems, 'Blockchain')).toEqual(expected);
    });

    it.each<[ string, Envs, Array<string> ]>([
      [ 'a multichain explorer', ENVS_MAP.multichain, [ 'Chain stats', 'Ecosystems', 'Gas tracker' ] ],
      [ 'a multichain explorer with cross-chain txs', [ ...ENVS_MAP.multichain, ...ENVS_MAP.crossChainTxs ], [ 'Chain stats', 'Ecosystems', 'Gas tracker' ] ],
      [ 'a chain with cross-chain txs', ENVS_MAP.crossChainTxs, [ 'Chain stats', 'Gas tracker', 'ICTT users' ] ],
    ])('lists the stats items of %s', async(_, envs, expected) => {
      const navItems = await loadNavItems(envs);

      expect(getSubItemTexts(navItems, 'Charts & stats')).toEqual(expected);
    });

    it('adds the withdrawals claim page to the Other group on an arbitrum rollup', async() => {
      const navItems = await loadNavItems(ENVS_MAP.arbitrumRollup);

      expect(getSubItemTexts(navItems, 'Other')).toEqual([ 'Verify contract', 'Txn withdrawals' ]);
    });

    it('gives every group its icon, and only the stats group a route of its own', async() => {
      const { mainNavItems } = await loadNavItems([]);

      expect(mainNavItems.filter(isGroup).map(({ subItems, ...group }) => group)).toEqual([
        { text: 'Blockchain', icon: 'navigation/blockchain', isActive: false },
        { text: 'Tokens', icon: 'navigation/tokens', isActive: false },
        { text: 'Charts & stats', icon: 'navigation/stats', isActive: false, nextRoute: { pathname: '/stats' } },
        { text: 'Other', icon: 'navigation/other', isActive: false },
      ]);
    });
  });

  describe('account navigation structure', () => {
    it('lists the account pages', async() => {
      const { accountNavItems } = await loadNavItems([]);

      expect(accountNavItems).toEqual([
        { text: 'Watch list', nextRoute: { pathname: '/account/watchlist' }, icon: 'navigation/watchlist', isActive: false },
        { text: 'Private tags', nextRoute: { pathname: '/account/tag-address' }, icon: 'navigation/private_tags', isActive: false },
        { text: 'API keys', nextRoute: { pathname: '/account/api-key' }, icon: 'navigation/api_keys', isActive: false },
        { text: 'Custom ABI', nextRoute: { pathname: '/account/custom-abi' }, icon: 'navigation/custom_abi', isActive: false },
        { text: 'Verified addrs', nextRoute: { pathname: '/account/verified-addresses' }, icon: 'navigation/verified_contracts', isActive: false },
      ]);
    });

    it('omits the verified addresses page when the account feature is off', async() => {
      const { accountNavItems } = await loadNavItems(ENVS_MAP.noAccount);

      expect(accountNavItems.map(({ text }) => text)).toEqual([ 'Watch list', 'Private tags', 'API keys', 'Custom ABI' ]);
    });
  });

  describe('item targets', () => {
    it.each<[ Envs, NavItem ]>([
      [ [], { text: 'Transactions', nextRoute: { pathname: '/txs' }, icon: 'navigation/transactions', isActive: false } ],
      [ [], { text: 'Internal transactions', nextRoute: { pathname: '/internal-txs' }, icon: 'navigation/internal_txns', isActive: false } ],
      [ [], { text: 'Blocks', nextRoute: { pathname: '/blocks' }, icon: 'navigation/block', isActive: false } ],
      [ [], { text: 'Top accounts', nextRoute: { pathname: '/accounts' }, icon: 'navigation/top_accounts', isActive: false } ],
      [ [], { text: 'Verified contracts', nextRoute: { pathname: '/verified-contracts' }, icon: 'navigation/verified_contracts', isActive: false } ],
      [ [], { text: 'Name services lookup', nextRoute: { pathname: '/name-services' }, icon: 'navigation/name_services', isActive: false } ],
      [ [], { text: 'Token transfers', nextRoute: { pathname: '/token-transfers' }, icon: 'navigation/token_transfers', isActive: false } ],
      [ [], { text: 'Chain stats', nextRoute: { pathname: '/stats' }, icon: 'navigation/chain_stats', isActive: false } ],
      [ [], { text: 'Gas tracker', nextRoute: { pathname: '/gas-tracker' }, icon: 'navigation/gas_tracker', isActive: false } ],
      [ [], { text: 'API', nextRoute: { pathname: '/api-docs' }, icon: 'navigation/api_docs', isActive: false } ],
      [ [], { text: 'Verify contract', nextRoute: { pathname: '/contract-verification' }, isActive: false } ],
      [ ALL_OPTIONAL_ITEMS, { text: 'User operations', nextRoute: { pathname: '/ops' }, icon: 'navigation/user_op', isActive: false } ],
      [ ALL_OPTIONAL_ITEMS, { text: 'Epochs', nextRoute: { pathname: '/epochs' }, icon: 'navigation/hourglass', isActive: false } ],
      [ ALL_OPTIONAL_ITEMS, { text: 'Validators', nextRoute: { pathname: '/validators' }, icon: 'navigation/validator', isActive: false } ],
      [ ALL_OPTIONAL_ITEMS, { text: 'DEX tracker', nextRoute: { pathname: '/pools' }, icon: 'navigation/dex_tracker', isActive: false } ],
      [ ALL_OPTIONAL_ITEMS, { text: 'Dapps', nextRoute: { pathname: '/apps' }, icon: 'navigation/apps', isActive: false } ],
      [ ALL_OPTIONAL_ITEMS, { text: 'Uptime', nextRoute: { pathname: '/uptime' }, icon: 'navigation/uptime', isActive: false } ],
      [ ALL_OPTIONAL_ITEMS, { text: 'Hot contracts', nextRoute: { pathname: '/hot-contracts' }, icon: 'navigation/hot_contracts', isActive: false } ],
      [ ALL_OPTIONAL_ITEMS, { text: 'Submit public tag', nextRoute: { pathname: '/public-tags/submit' }, isActive: false } ],
      [ ALL_OPTIONAL_ITEMS, { text: 'Duck', url: 'https://duck.io' } ],
      [ OPTIMISTIC_ROLLUP_FULL, { text: 'Deposits (L1→L2)', nextRoute: { pathname: '/deposits' }, icon: 'navigation/deposits', isActive: false } ],
      [ OPTIMISTIC_ROLLUP_FULL, { text: 'Withdrawals (L2→L1)', nextRoute: { pathname: '/withdrawals' }, icon: 'navigation/withdrawals', isActive: false } ],
      [ OPTIMISTIC_ROLLUP_FULL, {
        text: 'Interop messages',
        nextRoute: { pathname: '/interop-messages' },
        icon: 'navigation/cross_chain_txs',
        isActive: false,
      } ],
      [ OPTIMISTIC_ROLLUP_FULL, { text: 'Txn batches', nextRoute: { pathname: '/batches' }, icon: 'navigation/txn_batches', isActive: false } ],
      [ OPTIMISTIC_ROLLUP_FULL, { text: 'Dispute games', nextRoute: { pathname: '/dispute-games' }, icon: 'navigation/games', isActive: false } ],
      [ OPTIMISTIC_ROLLUP_FULL, { text: 'Output roots', nextRoute: { pathname: '/output-roots' }, icon: 'navigation/output_roots', isActive: false } ],
      [ ENVS_MAP.arbitrumRollup, { text: 'Txn withdrawals', nextRoute: { pathname: '/txn-withdrawals' }, isActive: false } ],
      [ ENVS_MAP.zetaChain, {
        text: 'Cross-chain transactions',
        nextRoute: { pathname: '/txs', query: { tab: 'cctx' } },
        icon: 'navigation/cross_chain_txs',
        isActive: false,
      } ],
      [ ENVS_MAP.tac, { text: 'Operations', nextRoute: { pathname: '/operations' }, icon: 'navigation/operation', isActive: false } ],
      [ ENVS_MAP.beaconChain, { text: 'Deposits', nextRoute: { pathname: '/deposits' }, icon: 'navigation/deposits', isActive: false } ],
      [ ENVS_MAP.beaconChain, { text: 'Withdrawals', nextRoute: { pathname: '/withdrawals' }, icon: 'navigation/withdrawals', isActive: false } ],
      [ ENVS_MAP.multichain, { text: 'Ecosystems', nextRoute: { pathname: '/ecosystems' }, icon: 'navigation/ecosystems', isActive: false } ],
      [ ENVS_MAP.multichain, { text: 'Verify contract', url: 'https://vera.blockscout.com' } ],
      [ ENVS_MAP.crossChainTxs, { text: 'ICTT users', nextRoute: { pathname: '/ictt-users' }, icon: 'navigation/ictt_users', isActive: false } ],
      [ ENVS_MAP.proApi, { text: 'API', url: 'https://dev.blockscout.com/?utm_source=blockscout&utm_medium=navigation', icon: 'navigation/api_docs' } ],
    ])('points "$1.text" at its page', async(envs, expected) => {
      const navItems = await loadNavItems(envs);

      expect(findLeafItem(navItems, expected.text)).toEqual(expected);
    });

    it('points the Tokens item at the tokens list', async() => {
      const { mainNavItems } = await loadNavItems([]);
      const tokensGroup = mainNavItems.find((item) => item.text === 'Tokens');

      expect(tokensGroup && isGroup(tokensGroup) && tokensGroup.subItems[0]).toEqual(
        { text: 'Tokens', nextRoute: { pathname: '/tokens' }, icon: 'navigation/tokens', isActive: false },
      );
    });
  });

  describe('active item', () => {
    it.each<[ string, Array<string>, Envs?, Record<string, string>? ]>([
      [ '/', [] ],
      [ '/txs', [ 'Blockchain', 'Transactions' ] ],
      [ '/tx/[hash]', [ 'Blockchain', 'Transactions' ] ],
      [ '/chain/[chain_slug_or_id]/tx/[hash]', [ 'Blockchain', 'Transactions' ] ],
      [ '/txs', [ 'Blockchain', 'Transactions' ], [], { tab: 'cctx' } ],
      [ '/txs', [ 'Blockchain', 'Transactions' ], ENVS_MAP.zetaChain ],
      [ '/txs', [ 'Blockchain', 'Transactions' ], ENVS_MAP.zetaChain, { tab: 'validated' } ],
      [ '/txs', [ 'Blockchain', 'Cross-chain transactions' ], ENVS_MAP.zetaChain, { tab: 'cctx' } ],
      [ '/txs', [ 'Blockchain', 'Cross-chain transactions' ], ENVS_MAP.zetaChain, { tab: 'cctx_pending' } ],
      [ '/cc/tx/[hash]', [ 'Blockchain', 'Cross-chain transactions' ], ENVS_MAP.zetaChain ],
      [ '/operations', [ 'Blockchain', 'Operations' ], ENVS_MAP.tac ],
      [ '/operation/[id]', [ 'Blockchain', 'Operations' ], ENVS_MAP.tac ],
      [ '/internal-txs', [ 'Blockchain', 'Internal transactions' ] ],
      [ '/ops', [ 'Blockchain', 'User operations' ], ALL_OPTIONAL_ITEMS ],
      [ '/op/[hash]', [ 'Blockchain', 'User operations' ], ALL_OPTIONAL_ITEMS ],
      [ '/chain/[chain_slug_or_id]/op/[hash]', [ 'Blockchain', 'User operations' ], ALL_OPTIONAL_ITEMS ],
      [ '/blocks', [ 'Blockchain', 'Blocks' ] ],
      [ '/block/[height_or_hash]', [ 'Blockchain', 'Blocks' ] ],
      [ '/chain/[chain_slug_or_id]/block/[height_or_hash]', [ 'Blockchain', 'Blocks' ] ],
      [ '/epochs', [ 'Blockchain', 'Epochs' ], ALL_OPTIONAL_ITEMS ],
      [ '/epochs/[number]', [ 'Blockchain', 'Epochs' ], ALL_OPTIONAL_ITEMS ],
      [ '/accounts', [ 'Blockchain', 'Top accounts' ] ],
      [ '/validators', [ 'Blockchain', 'Validators' ], ALL_OPTIONAL_ITEMS ],
      [ '/validators/[id]', [ 'Blockchain', 'Validators' ], ALL_OPTIONAL_ITEMS ],
      [ '/verified-contracts', [ 'Blockchain', 'Verified contracts' ] ],
      [ '/name-services', [ 'Blockchain', 'Name services lookup' ] ],
      [ '/name-services/domains/[name]', [ 'Blockchain', 'Name services lookup' ] ],
      [ '/deposits', [ 'Blockchain', 'Deposits (L1→L2)' ], OPTIMISTIC_ROLLUP_FULL ],
      [ '/withdrawals', [ 'Blockchain', 'Withdrawals (L2→L1)' ], OPTIMISTIC_ROLLUP_FULL ],
      [ '/interop-messages', [ 'Blockchain', 'Interop messages' ], OPTIMISTIC_ROLLUP_FULL ],
      [ '/batches', [ 'Blockchain', 'Txn batches' ], OPTIMISTIC_ROLLUP_FULL ],
      [ '/dispute-games', [ 'Blockchain', 'Dispute games' ], OPTIMISTIC_ROLLUP_FULL ],
      [ '/output-roots', [ 'Blockchain', 'Output roots' ], OPTIMISTIC_ROLLUP_FULL ],
      [ '/deposits', [ 'Blockchain', 'Deposits' ], ENVS_MAP.beaconChain ],
      [ '/withdrawals', [ 'Blockchain', 'Withdrawals' ], ENVS_MAP.beaconChain ],
      [ '/tokens', [ 'Tokens', 'Tokens' ] ],
      [ '/token/[hash]', [ 'Tokens', 'Tokens' ] ],
      [ '/token-transfers', [ 'Tokens', 'Token transfers' ] ],
      [ '/pools', [ 'Tokens', 'DEX tracker' ], ALL_OPTIONAL_ITEMS ],
      [ '/pool/[hash]', [ 'Tokens', 'DEX tracker' ], ALL_OPTIONAL_ITEMS ],
      [ '/apps', [ 'Dapps' ], ALL_OPTIONAL_ITEMS ],
      [ '/apps/[id]', [ 'Dapps' ], ALL_OPTIONAL_ITEMS ],
      [ '/essential-dapps/[id]', [ 'Dapps' ], ALL_OPTIONAL_ITEMS ],
      [ '/stats', [ 'Charts & stats', 'Chain stats' ] ],
      [ '/stats/[id]', [ 'Charts & stats', 'Chain stats' ] ],
      [ '/ecosystems', [ 'Charts & stats', 'Ecosystems' ], ENVS_MAP.multichain ],
      [ '/uptime', [ 'Charts & stats', 'Uptime' ], ALL_OPTIONAL_ITEMS ],
      [ '/hot-contracts', [ 'Charts & stats', 'Hot contracts' ], ALL_OPTIONAL_ITEMS ],
      [ '/gas-tracker', [ 'Charts & stats', 'Gas tracker' ] ],
      [ '/ictt-users', [ 'Charts & stats', 'ICTT users' ], ENVS_MAP.crossChainTxs ],
      [ '/api-docs', [ 'API' ] ],
      [ '/api-docs', [], ENVS_MAP.proApi ],
      [ '/contract-verification', [ 'Other', 'Verify contract' ] ],
      [ '/contract-verification', [], ENVS_MAP.multichain ],
      [ '/public-tags/submit', [ 'Other', 'Submit public tag' ], ALL_OPTIONAL_ITEMS ],
      [ '/txn-withdrawals', [ 'Other', 'Txn withdrawals' ], ENVS_MAP.arbitrumRollup ],
      [ '/account/watchlist', [ 'Watch list' ] ],
      [ '/account/tag-address', [ 'Private tags' ] ],
      [ '/account/api-key', [ 'API keys' ] ],
      [ '/account/custom-abi', [ 'Custom ABI' ] ],
      [ '/account/verified-addresses', [ 'Verified addrs' ] ],
    ])('on %s marks %j as active', async(pathname, expected, envs = [], query = {}) => {
      const navItems = await loadNavItems(envs, pathname, query);

      expect(getActiveTexts(navItems)).toEqual(expected);
    });
  });
});
