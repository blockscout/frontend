interface Props {
  address: string | undefined;
}

const wvmNetworks = [
  {
    archive_pool_address: '0x0000000000000000000000000000000000000000',
    archiver_address: '0xE5e289FC97C63f64B1EC5e061d7f176e02eBE5A0',
    backfill_address: '',
    block_time: 2.0,
    name: 'GOATDev',
    network_chain_id: 2345,
    network_rpc: 'http://3.15.141.150:8545',
    start_block: 20902,
    wvm_chain_id: 9496,
    wvm_rpc: 'https://testnet-rpc.wvm.dev',
  },
  {
    archive_pool_address: '0x0000000000000000000000000000000000000000',
    archiver_address: '0xd730fF10Ab359Fc4C0853DF9d108b7E646e645f4',
    backfill_address: '0x123463a4B065722E99115D6c222f267d9cABb524',
    block_time: 9.0,
    name: 'Metis',
    network_chain_id: 1088,
    network_rpc: 'https://andromeda.metis.io/?owner=1088',
    start_block: 18792105,
    wvm_chain_id: 9496,
    wvm_rpc: 'https://testnet-rpc.wvm.dev',
  },
  {
    archive_pool_address: '0x0000000000000000000000000000000000000000',
    archiver_address: '0xA6dC883ea2A6acb576A933B4d38D13d6069d9fBE',
    backfill_address: '',
    block_time: 2.0,
    name: 'RSS3 VSL Mainnet',
    network_chain_id: 12553,
    network_rpc: 'https://rpc.rss3.io',
    start_block: 6888111,
    wvm_chain_id: 9496,
    wvm_rpc: 'https://testnet-rpc.wvm.dev',
  },
  {
    archive_pool_address: '0x0000000000000000000000000000000000000000',
    archiver_address: '0x2D76d7B140d078C575eAAD109168c606FE9d506C',
    backfill_address: '0x55dA54ee977FBe734d5250F0558bc4B2FBe36b2a',
    block_time: 0.38999998569488525,
    name: 'SEI',
    network_chain_id: 1329,
    network_rpc: 'https://evm-rpc.sei-apis.com',
    start_block: 105238600,
    wvm_chain_id: 9496,
    wvm_rpc: 'https://testnet-rpc.wvm.dev',
  },
];

export function useWvmArchiver({ address }: Props) {
  const isWvmNetwork = wvmNetworks.some(
    (network) =>
      network.archiver_address === address ||
      (network.backfill_address && network.backfill_address === address),
  );

  return isWvmNetwork;
}
