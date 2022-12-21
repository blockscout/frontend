export type TxAction = {
  protocol: 'uniswap_v3';
  type: 'mint' | 'burn' | 'collect' | 'swap' | 'mint_nft';
  data: {
    name: string;
    symbol: string;
    address: string;
    to: string;
    ids: Array<string>;
    amount0: string;
    symbol0: string;
    address0: string;
    amount1: string;
    symbol1: string;
    address1: string;
  };
}
