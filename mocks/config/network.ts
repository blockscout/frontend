import type { FeaturedNetwork } from 'types/networks';

const FEATURED_NETWORKS: Array<FeaturedNetwork> = [
  { title: 'Gnosis Chain', url: 'https://blockscout.com/xdai/mainnet', group: 'mainnets', type: 'xdai_mainnet' },
  { title: 'Optimism on Gnosis Chain', url: 'https://blockscout.com/xdai/optimism', group: 'mainnets', type: 'xdai_optimism' },
  { title: 'Arbitrum on xDai', url: 'https://blockscout.com/xdai/aox', group: 'mainnets' },
  { title: 'Ethereum', url: 'https://blockscout.com/eth/mainnet', group: 'mainnets', type: 'eth_mainnet' },
  { title: 'Ethereum Classic', url: 'https://blockscout.com/etx/mainnet', group: 'mainnets', type: 'etc_mainnet', icon: 'https://example.com/my-logo.png' },
  { title: 'POA', url: 'https://blockscout.com/poa/core', group: 'mainnets', type: 'poa_core' },
  { title: 'RSK', url: 'https://blockscout.com/rsk/mainnet', group: 'mainnets', type: 'rsk_mainnet' },
  { title: 'Gnosis Chain Testnet', url: 'https://blockscout.com/xdai/testnet', group: 'testnets', type: 'xdai_testnet' },
  { title: 'POA Sokol', url: 'https://blockscout.com/poa/sokol', group: 'testnets', type: 'poa_sokol' },
  { title: 'ARTIS Σ1', url: 'https://blockscout.com/artis/sigma1', group: 'other', type: 'artis_sigma1' },
  { title: 'LUKSO L14', url: 'https://blockscout.com/lukso/l14', group: 'other', type: 'lukso_l14' },
  { title: 'Astar', url: 'https://blockscout.com/astar', group: 'other', type: 'astar' },
];

export const FEATURED_NETWORKS_MOCK = JSON.stringify(FEATURED_NETWORKS).replaceAll('"', '\'');
