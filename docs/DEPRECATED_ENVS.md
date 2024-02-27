# Deprecated environment variables

| Variable | Type | Description | Compulsoriness | Default value | Example value | Deprecated in version | Comment |
| --- | --- | --- | --- | --- | --- | --- | --- |
| NEXT_PUBLIC_IS_OPTIMISTIC_L2_NETWORK | `boolean` | Set to true for optimistic L2 solutions | Required | - | `true` | v1.24.0 | Replaced by NEXT_PUBLIC_ROLLUP_TYPE |
| NEXT_PUBLIC_IS_ZKEVM_L2_NETWORK | `boolean` | Set to true for zkevm L2 solutions  | Required | - | `true` | v1.24.0 | Replaced by NEXT_PUBLIC_ROLLUP_TYPE |
| NEXT_PUBLIC_OPTIMISTIC_L2_WITHDRAWAL_URL | `string` | URL for optimistic L2 -> L1 withdrawals | Required | - | `https://app.optimism.io/bridge/withdraw` | v1.24.0 | Renamed to NEXT_PUBLIC_ROLLUP_L2_WITHDRAWAL_URL |
| NEXT_PUBLIC_L1_BASE_URL | `string` | Blockscout base URL for L1 network | Required | - | `'http://eth-goerli.blockscout.com'` | v1.24.0 | Renamed to NEXT_PUBLIC_ROLLUP_L1_BASE_URL |
| NEXT_PUBLIC_HOMEPAGE_SHOW_GAS_TRACKER | `boolean` | Set to false if network doesn't have gas tracker | - | `true` | `false` | v1.25.0 | Replaced by NEXT_PUBLIC_GAS_TRACKER_ENABLED |