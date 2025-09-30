declare module 'react-identicons';
declare module 'use-font-face-observer';
declare module 'brotli-compress/js';

declare module '@fluent.xyz/sdk-core/dist/config/devnet-config' {
  export const DEVNET_NETWORK: string;
  export const DEVNET_NETWORK_NATIVE_CURRENCY: { name: string; symbol: string; decimals: number };
  export const DEVNET_EXPLORER_NAME: string;
  export const FLUENT_DEVNET_CHAIN_ID: number;
  export const DEVNET_EXPLORER_HOST: string;
  export const DEVNET_EXPLORER_URL: string;
  export const DEVNET_RPC_URL: string;
}

declare module '@fluent.xyz/sdk-core/dist/config/testnet-config' {
  export const TESTNET_NETWORK: string;
  export const TESTNET_NETWORK_NATIVE_CURRENCY: { name: string; symbol: string; decimals: number };
  export const TESTNET_EXPLORER_NAME: string;
  export const FLUENT_TESTNET_CHAIN_ID: number;
  export const TESTNET_EXPLORER_HOST: string;
  export const TESTNET_EXPLORER_URL: string;
  export const TESTNET_RPC_URL: string;
}
