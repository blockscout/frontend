# Deprecated environment variables

| Variable | Type | Description | Compulsoriness | Default value | Example value | Introduced in version | Deprecated in version | Comment |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_FAVICON_GENERATOR_API_KEY | `string` | RealFaviconGenerator [API key](https://realfavicongenerator.net/api/) | Required | - | `<your-secret>` | v1.11.0 | v1.16.0 | Replaced FAVICON_GENERATOR_API_KEY |
| FAVICON_GENERATOR_API_KEY | `string` | RealFaviconGenerator [API key](https://realfavicongenerator.net/api/) | Required | - | `<your-secret>` | v1.16.0+ | v1.37.0 | We don't use RealFaviconGenerator anymore |
| NEXT_PUBLIC_IS_OPTIMISTIC_L2_NETWORK | `boolean` | Set to true for optimistic L2 solutions | Required | - | `true` | v1.17.0 | v1.24.0 | Replaced by NEXT_PUBLIC_ROLLUP_TYPE |
| NEXT_PUBLIC_IS_ZKEVM_L2_NETWORK | `boolean` | Set to true for zkevm L2 solutions  | Required | - | `true` | v1.17.0 | v1.24.0 | Replaced by NEXT_PUBLIC_ROLLUP_TYPE |
| NEXT_PUBLIC_OPTIMISTIC_L2_WITHDRAWAL_URL | `string` | URL for optimistic L2 -> L1 withdrawals | Required | - | `https://app.optimism.io/bridge/withdraw` | v1.17.0 | v1.24.0 | Renamed to NEXT_PUBLIC_ROLLUP_L2_WITHDRAWAL_URL |
| NEXT_PUBLIC_L1_BASE_URL | `string` | Blockscout base URL for L1 network | Required | - | `'http://eth-goerli.blockscout.com'` | - | v1.24.0 | Renamed to NEXT_PUBLIC_ROLLUP_L1_BASE_URL |
| NEXT_PUBLIC_HOMEPAGE_SHOW_GAS_TRACKER | `boolean` | Set to false if network doesn't have gas tracker | - | `true` | `false` | - | v1.25.0 | Replaced by NEXT_PUBLIC_GAS_TRACKER_ENABLED |
| NEXT_PUBLIC_NETWORK_GOVERNANCE_TOKEN_SYMBOL | `string` | Network governance token symbol | - | - | `GNO` | v1.12.0 | v1.29.0 | Replaced by NEXT_PUBLIC_NETWORK_SECONDARY_COIN_SYMBOL |
| NEXT_PUBLIC_SWAP_BUTTON_URL | `string` | Application ID in the marketplace or website URL | - | - | `uniswap` | v1.24.0 | v1.31.0 | Replaced by NEXT_PUBLIC_DEFI_DROPDOWN_ITEMS |
| NEXT_PUBLIC_HOMEPAGE_SHOW_AVG_BLOCK_TIME | `boolean` | Set to false if average block time is useless for the network | - | `true` | `false` | v1.0.x+ | v1.35.0 | Replaced by NEXT_PUBLIC_HOMEPAGE_STATS |
