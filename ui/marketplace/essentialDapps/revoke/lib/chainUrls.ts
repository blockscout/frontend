import type { Chain } from 'viem';

const networks = {
  '100': 'https://gnosis.blockscout.com',
  '1': 'https://eth.blockscout.com',
  '30': 'https://rootstock.blockscout.com',
  '11155111': 'https://eth-sepolia.blockscout.com',
} as Record<string, string | { explorer: string; api: string; rpc: string }>;

// Initialize arrays and objects to store networks and explorer URLs.
const EXPLORER_URLS: Record<Chain['id'], string> = {};
const API_URLS: Record<Chain['id'], string> = {};
const RPC_URLS: Record<Chain['id'], string> = {};

// Use forEach to iterate over each network configuration entry.
Object.entries(networks).forEach(([ id, data ]) => {
  const isUrl = typeof data === 'string';
  EXPLORER_URLS[Number(id)] = isUrl ? data : data.explorer;
  API_URLS[Number(id)] = isUrl ? data : data.api;
  RPC_URLS[Number(id)] = isUrl ? `${ data }/api/eth-rpc` : data.rpc;
});

export { EXPLORER_URLS, API_URLS, RPC_URLS };
