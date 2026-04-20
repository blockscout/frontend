import type { ChainStatsChart, ChainStatsSection } from '../types/client';

export const CROSS_CHAIN_TXS_CHARTS: Array<ChainStatsChart> = [
  {
    id: 'outgoing-messages-paths',
    title: 'Cross-chain txns sent paths',
    description: 'Bridging volume trends over time',
    type: 'sankey',
    resourceName: 'interchainIndexer:stats_chain_messages_sent',
    resolutions: [],
  },
  {
    id: 'incoming-messages-paths',
    title: 'Cross-chain txns received paths',
    description: 'Bridging volume trends over time',
    type: 'sankey',
    resourceName: 'interchainIndexer:stats_chain_messages_received',
    resolutions: [],
  },
];

export const CROSS_CHAIN_TXS_SECTIONS: Array<ChainStatsSection> = [
  {
    id: 'messages',
    title: 'Messages',
    charts: CROSS_CHAIN_TXS_CHARTS,
  },
];
