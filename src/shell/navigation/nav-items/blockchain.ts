// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NavItem } from '../types';
import type { NavLocation } from './types';

import { layerLabels } from 'src/features/rollup/common/utils/layer';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';

import { rightLineArrow } from 'src/toolkit/utils/htmlEntities';

type Pathname = NavLocation['pathname'];

function getTxsItem({ pathname, tab }: NavLocation): NavItem {
  return {
    text: 'Transactions',
    nextRoute: { pathname: '/txs' as const },
    icon: 'navigation/transactions',
    isActive:
      // sorry, but this is how it was designed
      (pathname === '/txs' && (!config.features.zetachain.isEnabled || !tab || !tab.includes('cctx'))) ||
      pathname === '/tx/[hash]' ||
      pathname === '/chain/[chain_slug_or_id]/tx/[hash]',
  };
}

function getCctxsItem({ pathname, tab }: NavLocation): NavItem | null {
  if (!config.features.zetachain.isEnabled) {
    return null;
  }

  return {
    text: 'Cross-chain transactions',
    nextRoute: { pathname: '/txs' as const, query: { tab: 'cctx' } },
    icon: 'navigation/cross_chain_txs',
    isActive: pathname === '/cc/tx/[hash]' || (pathname === '/txs' && tab?.includes('cctx')),
  };
}

function getOperationsItem(pathname: Pathname): NavItem | null {
  if (!config.features.tac.isEnabled) {
    return null;
  }

  return {
    text: 'Operations',
    nextRoute: { pathname: '/operations' as const },
    icon: 'navigation/operation',
    isActive: pathname === '/operations' || pathname === '/operation/[id]',
  };
}

function getInternalTxsItem(pathname: Pathname): NavItem | null {
  if (!config.slices.internalTx.isEnabled) {
    return null;
  }

  return {
    text: 'Internal transactions',
    nextRoute: { pathname: '/internal-txs' as const },
    icon: 'navigation/internal_txns',
    isActive: pathname === '/internal-txs',
  };
}

function getUserOpsItem(pathname: Pathname): NavItem | null {
  if (!config.features.userOps.isEnabled) {
    return null;
  }

  return {
    text: 'User operations',
    nextRoute: { pathname: '/ops' as const },
    icon: 'navigation/user_op',
    isActive: pathname === '/ops' || pathname === '/op/[hash]' || pathname === '/chain/[chain_slug_or_id]/op/[hash]',
  };
}

function getBlocksItem(pathname: Pathname): NavItem {
  return {
    text: 'Blocks',
    nextRoute: { pathname: '/blocks' as const },
    icon: 'navigation/block',
    isActive: pathname === '/blocks' || pathname === '/block/[height_or_hash]' || pathname === '/chain/[chain_slug_or_id]/block/[height_or_hash]',
  };
}

function getEpochsItem(pathname: Pathname): NavItem | null {
  if (!config.features.celo.isEnabled) {
    return null;
  }

  return {
    text: 'Epochs',
    nextRoute: { pathname: '/epochs' as const },
    icon: 'navigation/hourglass',
    isActive: pathname.startsWith('/epochs'),
  };
}

function getTopAccountsItem(pathname: Pathname): NavItem | null {
  if (config.slices.address.hiddenViews?.top_accounts) {
    return null;
  }

  return {
    text: 'Top accounts',
    nextRoute: { pathname: '/accounts' as const },
    icon: 'navigation/top_accounts',
    isActive: pathname === '/accounts',
  };
}

function getValidatorsItem(pathname: Pathname): NavItem | null {
  if (!config.features.validators.isEnabled) {
    return null;
  }

  return {
    text: 'Validators',
    nextRoute: { pathname: '/validators' as const },
    icon: 'navigation/validator',
    isActive: pathname === '/validators' || pathname === '/validators/[id]',
  };
}

function getVerifiedContractsItem(pathname: Pathname): NavItem {
  return {
    text: 'Verified contracts',
    nextRoute: { pathname: '/verified-contracts' as const },
    icon: 'navigation/verified_contracts',
    isActive: pathname === '/verified-contracts',
  };
}

function getNameLookupItem(pathname: Pathname): NavItem | null {
  if (!config.features.nameServices.isEnabled) {
    return null;
  }

  return {
    text: 'Name services lookup',
    nextRoute: { pathname: '/name-services' as const },
    icon: 'navigation/name_services',
    isActive: pathname.startsWith('/name-services'),
  };
}

function getRollupDepositsItem(pathname: Pathname): NavItem {
  return {
    text: `Deposits (${ layerLabels.parent }${ rightLineArrow }${ layerLabels.current })`,
    nextRoute: { pathname: '/deposits' as const },
    icon: 'navigation/deposits',
    isActive: pathname === '/deposits',
  };
}

function getRollupWithdrawalsItem(pathname: Pathname): NavItem {
  return {
    text: `Withdrawals (${ layerLabels.current }${ rightLineArrow }${ layerLabels.parent })`,
    nextRoute: { pathname: '/withdrawals' as const },
    icon: 'navigation/withdrawals',
    isActive: pathname === '/withdrawals',
  };
}

function getRollupInteropMessagesItem(pathname: Pathname): NavItem | null {
  if (!getFeaturePayload(config.features.rollup)?.interopEnabled) {
    return null;
  }

  return {
    text: 'Interop messages',
    nextRoute: { pathname: '/interop-messages' as const },
    icon: 'navigation/cross_chain_txs',
    isActive: pathname === '/interop-messages',
  };
}

function getRollupTxnBatchesItem(pathname: Pathname): NavItem {
  return {
    text: 'Txn batches',
    nextRoute: { pathname: '/batches' as const },
    icon: 'navigation/txn_batches',
    isActive: pathname === '/batches',
  };
}

function getRollupDisputeGamesItem(pathname: Pathname): NavItem | null {
  if (!getFeaturePayload(config.features.rollup)?.faultProofSystemEnabled) {
    return null;
  }

  return {
    text: 'Dispute games',
    nextRoute: { pathname: '/dispute-games' as const },
    icon: 'navigation/games',
    isActive: pathname === '/dispute-games',
  };
}

function getRollupOutputRootsItem(pathname: Pathname): NavItem | null {
  if (!getFeaturePayload(config.features.rollup)?.outputRootsEnabled) {
    return null;
  }

  return {
    text: 'Output roots',
    nextRoute: { pathname: '/output-roots' as const },
    icon: 'navigation/output_roots',
    isActive: pathname === '/output-roots',
  };
}

function getBeaconChainDepositsItem(pathname: Pathname): NavItem | null {
  const feature = getFeaturePayload(config.features.beaconChain);

  if (!feature || feature.withdrawalsOnly) {
    return null;
  }

  return {
    text: 'Deposits',
    nextRoute: { pathname: '/deposits' as const },
    icon: 'navigation/deposits',
    isActive: pathname === '/deposits',
  };
}

function getBeaconChainWithdrawalsItem(pathname: Pathname): NavItem | null {
  if (!config.features.beaconChain.isEnabled) {
    return null;
  }

  return {
    text: 'Withdrawals',
    nextRoute: { pathname: '/withdrawals' as const },
    icon: 'navigation/withdrawals',
    isActive: pathname === '/withdrawals',
  };
}

function getOptimisticStackColumns(location: NavLocation): Array<Array<NavItem>> {
  const { pathname } = location;

  return [
    [
      getTxsItem(location),
      getInternalTxsItem(pathname),
      getRollupDepositsItem(pathname),
      getRollupWithdrawalsItem(pathname),
      getRollupInteropMessagesItem(pathname),
    ].filter(Boolean),
    [
      getBlocksItem(pathname),
      getEpochsItem(pathname),
      // currently, transaction batches are not implemented for Celo
      !config.features.celo.isEnabled ? getRollupTxnBatchesItem(pathname) : undefined,
      getRollupDisputeGamesItem(pathname),
      getRollupOutputRootsItem(pathname),
    ].filter(Boolean),
    [
      getUserOpsItem(pathname),
      getTopAccountsItem(pathname),
      getValidatorsItem(pathname),
      getVerifiedContractsItem(pathname),
      getNameLookupItem(pathname),
    ].filter(Boolean),
  ];
}

function getShibariumColumns(location: NavLocation): Array<Array<NavItem>> {
  const { pathname } = location;

  return [
    [
      getTxsItem(location),
      getInternalTxsItem(pathname),
      getRollupDepositsItem(pathname),
      getRollupWithdrawalsItem(pathname),
    ].filter(Boolean),
    [
      getBlocksItem(pathname),
      getUserOpsItem(pathname),
      getTopAccountsItem(pathname),
      getVerifiedContractsItem(pathname),
      getNameLookupItem(pathname),
    ].filter(Boolean),
  ];
}

function getZkSyncColumns(location: NavLocation): Array<Array<NavItem>> {
  const { pathname } = location;

  return [
    [
      getTxsItem(location),
      getInternalTxsItem(pathname),
      getUserOpsItem(pathname),
      getBlocksItem(pathname),
      getRollupTxnBatchesItem(pathname),
    ].filter(Boolean),
    [
      getTopAccountsItem(pathname),
      getValidatorsItem(pathname),
      getVerifiedContractsItem(pathname),
      getNameLookupItem(pathname),
    ].filter(Boolean),
  ];
}

function getFlatItems(location: NavLocation): Array<NavItem> {
  const { pathname } = location;

  return [
    getTxsItem(location),
    getOperationsItem(pathname),
    getInternalTxsItem(pathname),
    getCctxsItem(location),
    getUserOpsItem(pathname),
    getBlocksItem(pathname),
    getEpochsItem(pathname),
    getTopAccountsItem(pathname),
    getValidatorsItem(pathname),
    getVerifiedContractsItem(pathname),
    getNameLookupItem(pathname),
    getBeaconChainDepositsItem(pathname),
    getBeaconChainWithdrawalsItem(pathname),
  ].filter(Boolean);
}

export function getBlockchainNavItems(location: NavLocation): Array<NavItem> | Array<Array<NavItem>> {
  switch (getFeaturePayload(config.features.rollup)?.type) {
    case 'optimistic':
    case 'arbitrum':
    case 'scroll':
      return getOptimisticStackColumns(location);
    case 'shibarium':
      return getShibariumColumns(location);
    case 'zkSync':
      return getZkSyncColumns(location);
    default:
      return getFlatItems(location);
  }
}
