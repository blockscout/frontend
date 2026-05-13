import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const files = glob.sync('**/*.{ts,tsx}', {
  ignore: ['node_modules/**', '.next/**', 'codemod-home.mjs'],
  cwd: '/home/runner/work/frontend/frontend',
  absolute: true,
});

let changedCount = 0;

for (const file of files) {
  let content = readFileSync(file, 'utf-8');
  const original = content;

  if (file.includes('/client/slices/home/') || file.includes('/client/features/chain-stats/stubs/home') || 
      file.includes('/client/features/chain-stats/mocks/home') || file.includes('/client/features/rollup/') ||
      file.includes('/client/features/chain-variants/') || file.includes('/client/features/cross-chain-txs/') ||
      file.includes('/client/features/account/pages/home/') || file.includes('/client/slices/gas/')) {
    continue;
  }

  content = content.replace(/from 'types\/homepage'/g, "from 'configs/app/ui/homepage'");

  content = content.replace(
    /import type \{([^}]+)\} from 'types\/api\/stats'/g,
    (match, imports) => {
      const parts = imports.split(',').map(s => s.trim()).filter(Boolean);
      const homeStatsParts = parts.filter(p => p === 'HomeStats');
      const gasParts = parts.filter(p => p === 'GasPrices' || p === 'GasPriceInfo');
      const otherParts = parts.filter(p => p !== 'HomeStats' && p !== 'GasPrices' && p !== 'GasPriceInfo');
      const lines = [];
      if (homeStatsParts.length > 0) lines.push(`import type { ${homeStatsParts.join(', ')} } from 'client/slices/home/types/api'`);
      if (gasParts.length > 0) lines.push(`import type { ${gasParts.join(', ')} } from 'client/slices/gas/types/api'`);
      if (otherParts.length > 0) lines.push(`import type { ${otherParts.join(', ')} } from 'types/api/stats'`);
      return lines.join('\n');
    }
  );

  content = content.replace(/from 'stubs\/homepage'/g, "from 'client/slices/home/stubs'");
  content = content.replace(/from 'mocks\/stats\/daily_txs'/g, "from 'client/slices/home/mocks/charts'");
  content = content.replace(/from 'mocks\/stats\/main'/g, "from 'client/features/chain-stats/mocks/home'");
  content = content.replace(/from 'mocks\/stats\/index'/g, "from 'client/slices/home/mocks/stats'");
  content = content.replace(/from 'mocks\/stats'(?!\/)/g, "from 'client/slices/home/mocks/stats'");

  content = content.replace(
    /import \{([^}]+)\} from 'stubs\/stats'/g,
    (match, imports) => {
      const parts = imports.split(',').map(s => s.trim()).filter(Boolean);
      const homeParts = parts.filter(p => p === 'HOMEPAGE_STATS');
      const microserviceParts = parts.filter(p => p === 'HOMEPAGE_STATS_MICROSERVICE');
      const otherParts = parts.filter(p => p !== 'HOMEPAGE_STATS' && p !== 'HOMEPAGE_STATS_MICROSERVICE');
      const lines = [];
      if (homeParts.length > 0) lines.push(`import { ${homeParts.join(', ')} } from 'client/slices/home/stubs'`);
      if (microserviceParts.length > 0) lines.push(`import { ${microserviceParts.join(', ')} } from 'client/features/chain-stats/stubs/home'`);
      if (otherParts.length > 0) lines.push(`import { ${otherParts.join(', ')} } from 'stubs/stats'`);
      return lines.join('\n');
    }
  );

  const mappings = [
    ["from 'ui/home/fallbacks/rpcDataContext'", "from 'client/slices/home/contexts/rpc-data-context'"],
    ["from 'ui/home/homeDataContext'", "from 'client/slices/home/contexts/home-data-context'"],
    ["from 'ui/home/useHomeLatestBatchData'", "from 'client/features/rollup/common/hooks/useHomeLatestBatchData'"],
    ["from 'ui/home/useHomeBlocksData'", "from 'client/slices/home/hooks/useHomeBlocksData'"],
    ["from 'ui/home/Stats'", "from 'client/slices/home/pages/index/stats/Stats'"],
    ["from 'ui/home/LatestBlockStatsWidget'", "from 'client/slices/home/pages/index/stats/LatestBlockStatsWidget'"],
    ["from 'ui/home/LatestBatchStatsWidget'", "from 'client/slices/home/pages/index/stats/LatestBatchStatsWidget'"],
    ["from 'ui/home/fallbacks/StatsDegraded'", "from 'client/slices/home/pages/index/stats/StatsDegraded'"],
    ["from 'ui/home/Highlights'", "from 'client/slices/home/pages/index/highlights/Highlights'"],
    ["from 'ui/home/highlights/HighlightsItem'", "from 'client/slices/home/pages/index/highlights/HighlightsItem'"],
    ["from 'ui/home/HeroBanner'", "from 'client/slices/home/pages/index/HeroBanner'"],
    ["from 'ui/home/indicators/ChainIndicators'", "from 'client/slices/home/pages/index/charts/ChainIndicators'"],
    ["from 'ui/home/indicators/useChartDataQuery'", "from 'client/slices/home/hooks/useChartDataQuery'"],
    ["from 'ui/home/indicators/types'", "from 'client/slices/home/types/client'"],
    ["from 'ui/home/indicators/utils/chart'", "from 'client/slices/home/utils/chart'"],
    ["from 'ui/home/indicators/utils/indicators'", "from 'client/slices/home/utils/indicators'"],
    ["from 'ui/home/LatestBlocks'", "from 'client/slices/home/pages/index/blocks/LatestBlocks'"],
    ["from 'ui/home/LatestBlocksItem'", "from 'client/slices/home/pages/index/blocks/LatestBlocksItem'"],
    ["from 'ui/home/fallbacks/LatestBlocksDegraded'", "from 'client/slices/home/pages/index/blocks/LatestBlocksDegraded'"],
    ["from 'ui/home/fallbacks/LatestBlocksFallback'", "from 'client/slices/home/pages/index/blocks/LatestBlocksFallback'"],
    ["from 'ui/home/Transactions'", "from 'client/slices/home/pages/index/txs/Transactions'"],
    ["from 'ui/home/LatestTxs'", "from 'client/slices/home/pages/index/txs/LatestTxs'"],
    ["from 'ui/home/LatestTxsItem'", "from 'client/slices/home/pages/index/txs/LatestTxsItem'"],
    ["from 'ui/home/LatestTxsItemMobile'", "from 'client/slices/home/pages/index/txs/LatestTxsItemMobile'"],
    ["from 'ui/home/fallbacks/LatestTxsDegraded'", "from 'client/slices/home/pages/index/txs/LatestTxsDegraded'"],
    ["from 'ui/home/fallbacks/LatestTxsFallback'", "from 'client/slices/home/pages/index/txs/LatestTxsFallback'"],
    ["from 'ui/home/fallbacks/LatestTxsDegradedNewItems'", "from 'client/slices/home/pages/index/txs/LatestTxsDegradedNewItems'"],
    ["from 'ui/home/LatestWatchlistTxs'", "from 'client/features/account/pages/home/LatestWatchlistTxs'"],
    ["from 'ui/home/latestBatches/LatestArbitrumL2Batches'", "from 'client/features/rollup/arbitrum/pages/home/LatestArbitrumL2Batches'"],
    ["from 'ui/home/latestBatches/LatestBatchItem'", "from 'client/features/rollup/arbitrum/pages/home/LatestBatchItem'"],
    ["from 'ui/home/latestDeposits/LatestArbitrumDeposits'", "from 'client/features/rollup/arbitrum/pages/home/LatestArbitrumDeposits'"],
    ["from 'ui/home/latestDeposits/LatestOptimisticDeposits'", "from 'client/features/rollup/optimism/pages/home/LatestOptimisticDeposits'"],
    ["from 'ui/home/latestDeposits/LatestDeposits'", "from 'client/features/rollup/common/pages/home/LatestDeposits'"],
    ["from 'ui/home/latestZetaChainCCTX/LatestZetaChainCCTXs'", "from 'client/features/chain-variants/zeta-chain/pages/home/LatestZetaChainCCTXs'"],
    ["from 'ui/home/latestZetaChainCCTX/LatestZetaChainCCTXItem'", "from 'client/features/chain-variants/zeta-chain/pages/home/LatestZetaChainCCTXItem'"],
    ["from 'ui/home/latestCrossChainTxs/LatestCrossChainTxs'", "from 'client/features/cross-chain-txs/pages/home/LatestCrossChainTxs'"],
    ["from 'ui/home/latestCrossChainTxs/LatestCrossChainTxsItemDesktop'", "from 'client/features/cross-chain-txs/pages/home/LatestCrossChainTxsItemDesktop'"],
    ["from 'ui/home/utils'", "from 'client/slices/home/utils/stats'"],
    ["from 'ui/pages/Home'", "from 'client/slices/home/pages/index/Home'"],
  ];

  for (const [from, to] of mappings) {
    content = content.split(from).join(to);
  }

  if (content !== original) {
    writeFileSync(file, content, 'utf-8');
    changedCount++;
    console.log('Updated:', file.replace('/home/runner/work/frontend/frontend/', ''));
  }
}
console.log(`\nDone. Updated ${changedCount} files.`);
