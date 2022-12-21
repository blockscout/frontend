export type TxAction = {
  protocol: string;
  type: string;
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
  isLast: boolean;
}
