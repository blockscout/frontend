// chain info for external chains (not in the config)
// eg. zetachain cctx, interop txs, etc.
export type ChainInfo = {
  chain_id: number;
  chain_name: string | null;
  chain_logo?: string | null;
  instance_url?: string;
};
