import type { ChainStatsChart, ChainStatsSection } from 'client/features/chain-stats/types/client';

export const CROSS_CHAIN_TXS_CHARTS = [
  {
    id: 'outgoing-messages-paths' as const,
    title: 'Cross-chain txns sent paths',
    description: 'Bridging volume trends over time',
    type: 'sankey',
    resourceName: 'interchainIndexer:stats_chain_messages_sent',
    resolutions: [],
  },
  {
    id: 'incoming-messages-paths' as const,
    title: 'Cross-chain txns received paths',
    description: 'Bridging volume trends over time',
    type: 'sankey',
    resourceName: 'interchainIndexer:stats_chain_messages_received',
    resolutions: [],
  },
] satisfies Array<ChainStatsChart>;

export type CrossChainTxsChartId = (typeof CROSS_CHAIN_TXS_CHARTS)[number]['id'];

export const CROSS_CHAIN_TXS_SECTIONS: Array<ChainStatsSection> = [
  {
    id: 'messages',
    title: 'Messages',
    charts: CROSS_CHAIN_TXS_CHARTS,
  },
];
